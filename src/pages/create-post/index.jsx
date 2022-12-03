import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import 'react-markdown-editor-lite/lib/index.css';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});

export default function CreatePostPage(){
    function onImageUpload(file) {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = data => {
            resolve(data.target.result);
          };
          reader.readAsDataURL(file);
        });
      }

    return (
        <div className='flex items-center justify-center w-screen'>
            <div className='flex flex-col w-full mt-28 max-w-[1920px] px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-36'>
                <form onSubmit={()=>{}} className='flex flex-col w-full'>
                    <div className='flex flex-col mb-4'> 
                        <label>Enter post title</label>
                        <input type={'text'} required placeholder='Post title'></input>
                    </div>
                    <MdEditor
                        style={{height: '500px'}}
                        placeholder='Enter your markdown here' 
                        view={{fullScreen: false}}
                        imageAccept='.jpg,.png,.jpeg,.svg,.hevc'
                        onImageUpload={onImageUpload}
                        renderHTML={(text) => {
                            //Call set markdown in moralis here and send text
                            return <ReactMarkdown>{text}</ReactMarkdown>
                        }}
                    />
                    <div className='flex justify-end w-full mt-4'>
                        <button type='submit' className='px-8 py-2 bg-[#3d0b56] text-white rounded-lg'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}