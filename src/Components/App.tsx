import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { useLocalStorage } from "usehooks-ts";
import useShowHelperModal from "../hooks/useShowHelperModal";
import {LetterInformation} from '../types'
import { languageRegexes, randomIntFromInterval } from "../Utils";
import Button from "./Button";
import HelperDialog from "./HelperDialog";
import LoadingSpinner from "./LoadingSpinner";

interface ITest2Props {}

const App: React.FunctionComponent<ITest2Props> = (props) => {
  const [letterInformation, setLetterInformation] = useImmer<LetterInformation[][]>([]);
  const [translatedSentence,setTranslatedSentence] = useImmer<string[]>([])
  const [originalSentence, setOriginalSentence] = useState("");
  const [enteringSentence,setEnteringSentence] = useState(true);
  const [showHelperModal] = useShowHelperModal();
  const [isLoading,setIsLoading] = useState(false);

  /**Refs for the letter inputs.  */
  const inputRefs = useRef<React.RefObject<HTMLInputElement>[][]>([]);
  const sentenceInputRef = useRef<HTMLInputElement>(null)

  

  //Update letterinformation when enteredSentence changes
  useEffect(() => {
    
    const letterInformationArr : LetterInformation[][] = [];
    inputRefs.current = []
    translatedSentence.forEach((s) => {
      const arr: React.RefObject<HTMLInputElement>[] = [];
      const letterInformation : LetterInformation[] = [];
      s.split("").forEach((l) => {
        arr.push(React.createRef());
        const isPunctuation = !languageRegexes['german'].test(l)
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
  }, [setLetterInformation,translatedSentence]);

  useEffect(() => {
    if(enteringSentence) {
      sentenceInputRef.current?.select()
    } else {
      
      inputRefs.current[0][0].current?.select()
    }
  },[enteringSentence,letterInformation])


  const onKeyUp = (e:React.KeyboardEvent<HTMLInputElement>,
    wordNum: number,
    letterNum: number) => {
    const isBackspace = e.key === 'Backspace'
    const inputIsEmpty = e.currentTarget.value === ''
    
    if(isBackspace && inputIsEmpty) {
      selectNextPreviousAvailableInput(wordNum,letterNum)
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
        draft[wordNum][letterNum].inputLetter = value.toLowerCase()
        draft[wordNum][letterNum].inputTouched = true
      })
      if(languageRegexes['german'].test(value)) {
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
      
      try {
        const res = await fetch(`/.netlify/functions/translate?sentence=${sentenceInputRef.current?.value!}`);
        
        
        const json = await res.json();
        setTranslatedSentence(json.translation.trim().split(" ") as string[])
        setOriginalSentence(sentenceInputRef.current?.value!)
        // setEnteredSentence("I hope that this works".trim().split(" "))
        setEnteringSentence(false)
      } catch (error) {
        
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

  const selectNextPreviousAvailableInput = (fromWord:number, fromLetter:number) => {
    if(!isFirstLetterofFirstWord(fromWord,fromLetter)) {
      let [previousWord, previousLetter] = getPreviousLetterInput(fromWord,fromLetter)

      while(inputIsDisabled(previousWord,previousLetter)) {
        if(isFirstLetterofFirstWord(previousWord,previousLetter)) {return}
        [previousWord, previousLetter] = getPreviousLetterInput(previousWord,previousLetter)
      }

      selectInput(previousWord, previousLetter)
    }
  }


  const inputIsDisabled = (wordNum: number,letterNum: number) => {
    return inputRefs.current[wordNum][letterNum].current?.disabled
  }

  
  const selectInput = (wordNum: number,letterNum: number) => {
    return inputRefs.current[wordNum][letterNum].current?.select()
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
    <div className="relative min-h-screen bg-blue-900 flex py-32 px-5">
      <div className="max-w-5xl mx-auto flex-1 text-white space-y-14">
        <h1 className="text-5xl tracking-wider text-center">Sentence Guesser</h1>
        <HelperDialog isOpen={showHelperModal}>
          <p>
          Sentence Guesser works by taking an English sentence that you provide, translating it to German with DeepL, then returning it to you in the form of a fill-in-the-blanks exercise.
          </p>
          <p>
          Try to enter a sentence and see if you can fill in the missing letters yourself!
          </p>
        </HelperDialog>
        
        {enteringSentence ?        
          <form id="sentenceform" onSubmit={translate} className="space-y-8 grid">
            <input required placeholder="Enter sentence to translate..." ref={sentenceInputRef} className="p-2 w-full outline-none bg-transparent m-auto border-b-2 " type="text" name="" id="" />
            <div className="justify-self-center">
            <Button  type="submit" >Translate sentence</Button>
            </div>
          </form>
          :
          <p className="text-xl">{originalSentence}</p>
        }
        <div className="grid md:grid-flow-col gap-4 md:justify-start">
          {!enteringSentence &&
            <>            
              <Button onClick={removeAllWrongLetters}>Remove all wrong</Button>
              <Button onClick={tryNewSentence} >Try new sentence</Button>
            </>

          }
        </div>
        <div className="font-mono">
        {isLoading && <LoadingSpinner/>}
        {letterInformation.length > 0 &&
          letterInformation.map((s, i) => (
            <div key={i} className="inline-grid px-3 py-3 md:py-7 md:px-4">
              <div className="space-x-2">
              {s.map(({inputLetter,letter,inputTouched,isPunctuation}, j) => (
                <input
                  type="text"
                  autoCorrect="off" 
                  autoCapitalize="off"
                  key={`${j}${i}`}
                  maxLength={1} 
                  value={inputLetter}
                  onInput={(e) => onInput(e, i, j)}
                  onKeyUp={e => onKeyUp(e,i,j)}
                  ref={inputRefs.current[i][j]}
                  disabled={letter === inputLetter}
                  className={[
                    "w-[1ch] outline-none text-base sm:text-2xl md:text-3xl pb-1 bg-transparent rounded-none disabled:opacity-100",
                    isPunctuation ? "" : "border-b-2 border-solid "+((!inputTouched ? "border-white" : (letter === inputLetter ? "border-green-300":"border-red-500")))
                ].join(" ")}
                />
              ))}
              </div>
              <button onMouseDown={e => e.preventDefault()} onClick={e => revealRandLetter(i)} className="mt-4 text-xs opacity-40 hover:opacity-100">Reveal</button>
            </div>
          ))}
        </div>
      </div>
      <p className="absolute bottom-4 text-xs left-4 text-white opacity-75">Made by Boris Grunwald</p>
    </div>
  );
};

export default App;
