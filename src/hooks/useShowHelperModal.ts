import { useEffect } from "react"
import { useLocalStorage } from "usehooks-ts"

const useShowHelperModal = () => {
    const [numberofvisits,setNumberofvisits] = useLocalStorage("numberofvisits",0)
    
    useEffect(() => {
        setNumberofvisits(prev => prev+1)
    },[setNumberofvisits])

    
    

    return [numberofvisits < 1]
}

export default useShowHelperModal;