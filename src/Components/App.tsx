import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import {LetterInformation} from '../types'
import { Language, languageRegexes, randomIntFromInterval } from "../Utils";
import Button from "./Button";
import LetterInput from "./LetterInput";
import LoadingSpinner from "./LoadingSpinner";
import SentenceGuesserHeader from "./SentenceGuesserHeader";
import TranslateForm from "./TranslateForm";

interface ITest2Props {}

const App: React.FunctionComponent<ITest2Props> = (props) => {
  const [letterInformation, setLetterInformation] = useImmer<LetterInformation[][]>([]);
  const [translatedSentence,setTranslatedSentence] = useImmer<string[]>([])
  const [originalSentence, setOriginalSentence] = useState("");
  const [enteringSentence,setEnteringSentence] = useState(true);
  const [languageToTranslateInto] = useState<Language>("german")
  const [isLoading,setIsLoading] = useState(false);


  /**Refs for the letter inputs.  */
  const inputRefs = useRef<React.RefObject<HTMLInputElement>[][]>([]);

  

  //Update letterinformation when enteredSentence changes
  useEffect(() => {
    
    const letterInformationArr : LetterInformation[][] = [];
    inputRefs.current = []
    translatedSentence.forEach((s) => {
      const arr: React.RefObject<HTMLInputElement>[] = [];
      const letterInformation : LetterInformation[] = [];
      s.split("").forEach((l) => {
        arr.push(React.createRef());
        const isPunctuation = !languageRegexes[languageToTranslateInto].test(l)
        letterInformation.push({
          letter:l.toLowerCase(),
          //If character is not a letter (meaning it is punctuation), then it should be revealed.
          inputLetter : isPunctuation ? l:"",
          isPunctuation,
          inputTouched:false
        })
      });
      letterInformationArr.push(letterInformation)
      inputRefs.current.push(arr);

    });

    setLetterInformation(letterInformationArr);
  }, [setLetterInformation,translatedSentence,languageToTranslateInto]);



  const onKeyUp = (e:React.KeyboardEvent<HTMLInputElement>,
    wordNum: number,
    letterNum: number) => {
    const isBackspace = e.key === 'Backspace'
    
    if(isBackspace) {
      const [wordToSelect,letterToSelect] = getNextPreviousAvailableInput(wordNum,letterNum)
      clearInput(wordToSelect,letterToSelect)
      selectInput(wordToSelect,letterToSelect)

    } 

  }

  /**
   * Reveals one random letter of the specified word
   * @param wordNumber - index of the word which will have one letter revealed.
   */
  const revealRandLetter = (wordNumber:number) => {  
      setLetterInformation(draft => {
        const wrongLetters = draft[wordNumber].filter(({letter,inputLetter}) => letter !== inputLetter)
        
        if(wrongLetters.length > 0) {
          const hiddenLetterToReveal = wrongLetters[randomIntFromInterval(0,wrongLetters.length-1)]
          hiddenLetterToReveal.inputLetter = hiddenLetterToReveal.letter
          hiddenLetterToReveal.inputTouched = true
        }
      })
  }

  const onInput = (
    e: React.FormEvent<HTMLInputElement>,
    wordNum: number,
    letterNum: number
  ) => {
    const value = e.currentTarget.value;
      setLetterInformation(draft => {
        draft[wordNum][letterNum].inputLetter = value
        draft[wordNum][letterNum].inputTouched = true
      })
      if(languageRegexes[languageToTranslateInto].test(value)) {
        selectNextAvailableInput(wordNum,letterNum)
      }
  };

  const tryNewSentence = () => {
    setLetterInformation([])
    setEnteringSentence(true)
  }

  const translate = async (e:React.FormEvent<HTMLFormElement>) => {
      setIsLoading(true)
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const translationInputText = formData.get("test")
      
      
      
      try {
        const res = await fetch(`/.netlify/functions/translate?sentence=${translationInputText}`);
        
        if (!res.ok) {
          const message = `An error has occured: ${res.status} ${res.statusText}`;
          throw new Error(message);
        }
        
        const json = await res.json();
        setTranslatedSentence(json.translation.trim().split(" ") as string[])
        setOriginalSentence(translationInputText?.toString()!)
        setEnteringSentence(false)
      } catch (error) {
        alert(error)
      }

      setIsLoading(false)
      
    
      
    
  }

  /**
   *  Select the next available letter input skipping all the disabled inputs until the next non disabled input or the last letter is reached
   * @param fromWord - the word to start from 
   * @param fromLetter - the letter of the word to start from
   */
  const selectNextAvailableInput = (fromWord:number, fromLetter:number) => {
    if(!isLastLetterOfLastWord(fromWord,fromLetter)) {
      let [nextWordNumber,nextLetterNumber] = getNextLetterInput(fromWord,fromLetter)
  
      while(inputIsDisabled(nextWordNumber,nextLetterNumber)) {
        if(isLastLetterOfLastWord(nextWordNumber,nextLetterNumber)) {return}
        [nextWordNumber,nextLetterNumber] = getNextLetterInput(nextWordNumber,nextLetterNumber)
      }
  
      selectInput(nextWordNumber,nextLetterNumber)
    }
    
  }

  const getNextPreviousAvailableInput = (fromWord:number, fromLetter:number) => {
    if(!isFirstLetterofFirstWord(fromWord,fromLetter)) {
      let [previousWord, previousLetter] = getPreviousLetterInput(fromWord,fromLetter)

      while(inputIsDisabled(previousWord,previousLetter)) {
        if(isFirstLetterofFirstWord(previousWord,previousLetter)) {return [fromWord,fromLetter]}
        [previousWord, previousLetter] = getPreviousLetterInput(previousWord,previousLetter)
      }

      return [previousWord, previousLetter]
    } 

      return [fromWord,fromLetter]
    

  }


  const inputIsDisabled = (wordNum: number,letterNum: number) => {
    return inputRefs.current[wordNum][letterNum].current?.disabled
  }

  
  const selectInput = (wordNum: number,letterNum: number) => {
    return inputRefs.current[wordNum][letterNum].current?.focus()
  }


  /**
   * Return the word and letter index of the next letter input (the input to the right)
   * @param fromWord - the word to start from 
   * @param fromLetter - the letter of the word to start from
   * @returns Tuple containing the next word and letter indexes
   */
  const getNextLetterInput = (fromWord:number,fromLetter:number) : [nextWord:number,nextLetter:number] => {
    if (isLastLetterOfWord(fromWord,fromLetter)) {
      return [fromWord+1,0]
    } else {
      return [fromWord,fromLetter+1]
    }
  }

  const getPreviousLetterInput = (fromWord:number,fromLetter:number) : [previousWord:number,previousLetter:number] => {
    if (fromLetter === 0) {
      return [fromWord - 1,letterInformation[fromWord-1].length-1]
    } else {
      return [fromWord,fromLetter-1]
    }
  }

  const isLastLetterOfWord = (wordNumber:number,letterNumber:number) => {
    return letterInformation[wordNumber].length - 1 === letterNumber;
  }

  const isLastWord = (wordNumber:number) => {
    return letterInformation.length - 1 === wordNumber
  }

  const isLastLetterOfLastWord= (wordNumber:number,letterNumber:number) => {
    return isLastWord(wordNumber) && isLastLetterOfWord(wordNumber,letterNumber);
  }

  const isFirstLetterofFirstWord = (wordNumber:number,letterNumber:number) => {
    return wordNumber === 0 && letterNumber === 0;
  }


  const clearInput = (wordNumber:number,letterNumber:number) => {

      setLetterInformation(draft => {
        draft[wordNumber][letterNumber].inputLetter = ''
        draft[wordNumber][letterNumber].inputTouched = false
      })
    
  }

  const removeAllWrongLetters = () => {
    setLetterInformation(draft => {
      draft.forEach(l =>
        l.forEach(i => {
          if(i.inputLetter !== i.letter) {
            i.inputLetter = ''
            i.inputTouched = false
          }
        })
      )
    })
  }

  return (
    <div className="relative min-h-screen bg-slate-800  flex py-32 px-5">
      <div className="max-w-5xl m-auto flex-1 text-white space-y-14">
        {enteringSentence && <SentenceGuesserHeader/>}        
        {enteringSentence ?        
          <TranslateForm onSubmit={translate}/>
          :
          <> 
          <div className="">
            <p className="mb-2 font-bold">You entered the sentence:</p>
            <p className="text-xl sticky top-4 bg-slate-800">{originalSentence}</p>
          </div>
          </>
        }
        {!enteringSentence && <>
        <div className="grid md:grid-flow-col gap-4 md:justify-start">
          
            <>            
              <Button onClick={removeAllWrongLetters}>Remove all wrong</Button>
              <Button onClick={tryNewSentence} >Try new sentence</Button>
            </>

        </div>
        <div className="font-mono">
        {isLoading && <LoadingSpinner/>}
        {letterInformation.length > 0 &&
          letterInformation.map((s, i) => (
            <div key={i} className="inline-grid px-3 py-3 md:py-7 md:px-4">
              <div className="space-x-1">
              {s.map(({inputLetter,letter,inputTouched,isPunctuation}, j) => (
                <LetterInput
                  key={`${j}${i}`} //Should be ok to use indexes as keys since order of inputs doesn't change
                  value={inputLetter}
                  onInput={(e) => onInput(e, i, j)}
                  onKeyUp={e => onKeyUp(e,i,j)}
                  ref={inputRefs.current[i][j]} //Add inputref to each individual input
                  autoFocus={i === 0 && j === 0} //Autofocus first letter input
                  correctLetter={letter.toLocaleLowerCase()}
                  disabled={letter.toLocaleLowerCase() === inputLetter.toLocaleLowerCase()}
                  className={[
                    "w-[1ch] outline-none text-base sm:text-2xl md:text-3xl pb-1 bg-transparent rounded-none disabled:opacity-100",
                    isPunctuation ? "" : "border-b-2 border-solid "+((!inputTouched ? "border-white" : (letter.toLocaleLowerCase() === inputLetter.toLocaleLowerCase() ? "border-green-300":"border-red-500")))
                ].join(" ")}
                />
              ))}
              </div>
              <button onMouseDown={e => e.preventDefault()} onClick={e => revealRandLetter(i)} className="mt-4 text-xs opacity-40 hover:opacity-100">Reveal</button>
            </div>
          ))}
        </div>
        </>
        }

      </div>
      <p className="absolute bottom-4 text-xs left-4 text-white opacity-75">Made by <a href="https://borisgrunwald.me" className="underline">Boris Grunwald</a></p>
    </div>
  );
};

export default App;
