import {createContext, useContext, useEffect, useState} from 'react'

const ListsContext = createContext({
    lists: [], fetchLists: () => {
    }
})

function AddList() {
    const [item, setItem] = useState({
        companyName: "",
        jobTitle: "",
        workType: "",
        pay: 0
    });

    const [err, setErr] = useState("")

    const {lists, fetchLists} = useContext(ListsContext);

    const handleInput = (e) => {
        setItem({...item, [e.target.name]: e.target.value})
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (!item.companyName || !item.jobTitle) {
            setErr("Do not leave anything blank.");
            return;
        }
        const newList = {
            ...item
        }

        fetch("http://localhost:8000/job/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newList)
        }).then(fetchLists())
        window.location.reload();
    }

    return (
        <>
            {err && <input readOnly className="form-control-plaintext" value={err} style={{color: 'red'}}/>}
            <form onSubmit={handleSubmit}>
                <label className='col-sm-2 col-form-label'> Company Name
                    <input type='text' name="companyName" value={item.companyName} onChange={handleInput}
                           className="form-control"/>
                </label>
                <label> Job Title
                    <input type='text' name="jobTitle" value={item.jobTitle} onChange={handleInput}
                           className="form-control"/>
                </label>
                <label> Work Type
                    <input type='text' name="workType" value={item.workType} onChange={handleInput}
                           className="form-control"/>
                </label>
                <label> Salary
                    <input type='number' name="pay" value={item.pay} onChange={handleInput} className="form-control"/>
                </label>
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}

export default function JobLists() {
    const [lists, setLists] = useState([])
    const fetchLists = async () => {
        const res = await fetch("http://localhost:8000/jobs/?skip=0&limit=100");
        const db = await res.json();
        console.log(db)
        return db
    }
    useEffect(() => {
        fetchLists().then(db => setLists(db));
    }, [])
    return (
        <ListsContext.Provider value={{lists, fetchLists}}>
            <AddList/>
            <table>
                <tbody>
                <tr>
                    <th>Company Name</th>
                    <th>Job Title</th>
                    <th>Type</th>
                    <th>Salary</th>
                </tr>
                {lists.map(ls => {
                    const arr = Object.entries(ls)
                    return (<tr key={ls.id}>
                        {arr.map(([k, v]) => {
                            return (v && k != 'id' ? <td key={k}>{v}</td> : null)
                        })}
                    </tr>)
                })}
                </tbody>

            </table>
        </ListsContext.Provider>
    )
}