import * as React from 'react';

interface IHelperDialogProps {
    onClose: () => void
}

const HelperDialog: React.FunctionComponent<IHelperDialogProps> = (props) => {
  return (
    <div className='fixed inset-0 bg-black/50 flex justify-center items-center'>
        <div className='bg-slate-700 p-5 rounded-lg max-w-lg text-white space-y-3'>
            <h2 className='text-xl font-bold'>How does it work?</h2>
            <p>You enter a sentence and choose a language to translate it into.</p>
            <p>Then you have to guess the translated sentence by entering the correct letters. Non-character letters are automatically filled in for you.</p>
            <p>You can reveal a random letter of a word by pressing the reveal button below the word.</p>
            <div className='text-right'>
                <button onClick={props.onClose} className='bg-slate-600 px-4 py-2 rounded-lg hover:bg-slate-500'>Close</button>
            </div>
        </div>
    </div>
  );
};

export default HelperDialog;