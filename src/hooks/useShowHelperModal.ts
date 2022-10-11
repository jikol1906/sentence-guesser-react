import { useEffect } from "react"
import { useLocalStorage } from "usehooks-ts"

export default () => {
    const [numberofvisits,setNumberofvisits] = useLocalStorage("numberofvisits",0)

    useEffect(() => {
        setNumberofvisits(numberofvisits+1)
    },[])

    return [numberofvisits <= 0]
}