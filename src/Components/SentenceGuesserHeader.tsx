import * as React from "react";
import { useEffect } from "react";
import { useSessionStorage } from "usehooks-ts";

interface ISentenceGuesserHeaderProps {}

const SentenceGuesserHeader: React.FunctionComponent<
  ISentenceGuesserHeaderProps
> = (props) => {
    
    const [didRunAnimation, setDidRunAnimation] = useSessionStorage("didrun",false)

    useEffect(() => {
        return () => {
            setDidRunAnimation(true)
        }
    },[setDidRunAnimation])

  return (
    <div className="flex justify-center">
      <div className="relative text-2xl xs:text-3xl sm:text-4xl md:text-5xl leading-none" >
        <h1 className="grid grid-cols-[repeat(16,1fr)] gap-1 sm:gap-2 md:gap-4 lg:gap-6  font-mono font-thin uppercase">
            {"sentence".split("").map((c,i)=><span key={i} className="border-b-2 pb-2 border-b-white">{c}</span>)}
            <span> </span>
            {"guesser".split("").map((c,i)=><span key={i} className="border-b-2 pb-2 border-b-white">{c}</span>)}
        </h1>
        {!didRunAnimation && <span className="absolute top-0 right-0 h-[1em] bg-slate-800 border-l-2 border-l-white animate-typewriter-reveal"></span>}
      </div>
    </div>
  );
};

export default SentenceGuesserHeader;
