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
            id: lists.length + 1,
            ...item
        }

        fetch("http://localhost:8000/list/", {
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
                           class="form-control"/>
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
        const res = await fetch("http://localhost:8000/lists/");
        const db = await res.json();
        return db
    }
    useEffect(() => {
        fetchLists().then(db => setLists(db.data));
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
                    const arr = Object.entries(ls).slice(1, 5)
                    return (<tr key={ls.id}>
                        {arr.map(([k, v]) => {
                            return (v ? <td key={k}>{v}</td> : <td key={k}> None </td>)
                        })}
                    </tr>)
                })}
                </tbody>

            </table>
        </ListsContext.Provider>
    )
}