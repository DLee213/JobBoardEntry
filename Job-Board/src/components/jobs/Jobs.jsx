import {useState, useEffect} from "react"
import axios from 'axios'

const Jobs = () => {
  const [data, setData] = useState();
  const url = "http://localhost:3000/data"


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(url)
        if (res.status === 200) {
          setData(JSON.stringify(res.data))
          
          console.log(data)
        }

      } catch (err) {
          console.error(err)
      }
    }

    fetchData()
  }, [])

  return (
    <div>Jobs</div>
  )
}

export default Jobs