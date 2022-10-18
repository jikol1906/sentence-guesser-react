import * as React from "react";
import Button from "./Button";

interface ITranslateFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {}

const TranslateForm: React.FunctionComponent<ITranslateFormProps> = ({
  onSubmit,
}) => {

  return (
    <form onSubmit={onSubmit} className="space-y-8 grid">
      <input
        required
        placeholder="Enter sentence to translate..."
        className="p-2 w-full outline-none bg-transparent m-auto border-b-2 rounded-none"
        type="text"
        name="test"
        id=""
        autoFocus={true}
      />
      <div className="justify-self-center">
        <Button type="submit">Translate sentence</Button>
      </div>
    </form>
  );
};

export default TranslateForm;
