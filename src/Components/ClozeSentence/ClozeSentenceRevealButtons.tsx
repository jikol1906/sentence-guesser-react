import { WordType } from "../../types";
import Button from "../Button";

type Props = {
    words: WordType[];
    onRevealLetter: (wordIndex: number) => void;
}


const ClozeSentenceRevealButtons = ({words, onRevealLetter} : Props) => (
    <div className="text-lg flex-row flex gap-4">
      {words
        .filter((word) => typeof word === "object")
        .map((_, i, arr) => (
          <Button onClick={() => onRevealLetter(i)}>
            Reveal letter {arr.length > 1 ? `in word ${i + 1}` : ""}
          </Button>
        ))}
    </div>
);

export default ClozeSentenceRevealButtons;