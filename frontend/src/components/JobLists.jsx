import {createContext, useContext, useEffect, useState} from 'react'

const ListsContext = createContext({
    lists: [], fetchLists: () => {
    }
})

function AddList() {
    const [item, setItem] = useState("");
    const {lists, fetchLists} = useContext(ListsContext);

    const handleInput = (e) => {
        setItem(e.target.value)
    }

    const handleSubmit = e => {
        const newList = {
            id: lists.length + 1,
            companyName: item,
            jobTitle: "Software Engineer"
        }

        fetch("http://localhost:8000/list/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newList)
        }).then(fetchLists())
    }

    return (
        <form onSubmit={handleSubmit}>
            <input onChange={handleInput}/>
        </form>
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
                    // const arr = []
                    // arr.push(ls.companyName)
                    // arr.push(ls.jobTitle)
                    // arr.push(ls.workType)
                    // arr.push(ls.pay)
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