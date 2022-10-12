import { useEffect } from "react"
import { useLocalStorage } from "usehooks-ts"

const useShowHelperModal = () => {
    const [numberofvisits,setNumberofvisits] = useLocalStorage("numberofvisits",0)
    
    useEffect(() => {
        setNumberofvisits(numberofvisits+1)
    },[numberofvisits,setNumberofvisits])

    
    

    return [numberofvisits < 1]
}

export default useShowHelperModal;