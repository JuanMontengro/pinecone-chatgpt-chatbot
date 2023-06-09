import Head from 'next/head'
import { ulid } from "ulid";
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import CheckIcon from './component/checkIcon'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [prompt, setprompt] = useState("")
  const [query, setquery] = useState("")

  const [title, settitle] = useState("")
  const [activePage, setactivePage] = useState("chat")
  const [messages, setmessages] = useState([
    {id:1, type:"chatbot", message:"how may I help you?"},
])

  const [results, setresults] = useState("")


  // add info in pinecone knowledge base
   const onSubmit =async(e:any)=>{
    e.preventDefault();
    try {
      const response= await fetch('/api/openaiAPI',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({prompt, title})
      })
      const data =await response.json();
      if(response.status !== 200){
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setresults(data.result)
    } catch (error:any) {
      console.error(error);
      alert(error.message);
    }
   }

   const onSendQuery=async(e:any)=>{
    
    e.preventDefault();

    try {

      let temp= messages.slice()
      temp.push( {   id:Math.random(), type:"user",message:query})

      let apiMessages=[]
      for (const iterator of temp) {
        let role=""
        if (iterator.type === "chatbot") {
          role = "assistant";
        } else {
          role = "user";
        }
        apiMessages.push({role, content:iterator.message})


      }
    

      setmessages(temp)
     
      const response= await fetch('/api/queryAPI',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          prompt:query,
          apiMessages
        })
      })
      const data =await response.json();
      if(response.status !== 200){
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      temp.push({   id:Math.random(), type:"chatbot",message:data.data})
      setmessages(temp)
      setquery("")
      // setresults(data.result)
    } catch (error:any) {
      console.error(error);
      alert(error.message);
    }
   }


   const renderKnowledgeBase=()=>{
    return(
      <div className='w-[100%] mt-20 md:mt-0 md:w-[40vw]'>

        <p className='text-white font-semibold text-2xl mb-10 capitalize  tracking-tighter'>Knowledge base</p>
        <form className='flex flex-col space-y-4' onSubmit={onSubmit}>
        <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={title}
            className={'h-[50px] rounded-lg px-4  w-[70vw] md:w-[30vw]'}
            onChange={(e) => settitle(e.target.value)}
          />
          <input
            type="text"
            name="prompt"
            placeholder="Enter prompt message"
            value={prompt}
            className={'h-[250px] rounded-lg px-4  w-[70vw] md:w-[30vw]'}
            onChange={(e) => setprompt(e.target.value)}
          />
          <input  className='text-white   w-[70vw] md:w-[30vw] bg-blue-400 p-5 py-3 rounded-md cursor-pointer' type="submit" value="Submit" />
        </form>
        <div className={styles.result}>{JSON.stringify(results)}</div>
        </div>
    )
   }

   const renderChat=()=>{
    return(
      <div className='w-[100%] mt-20 md:mt-0 md:w-[40vw] flex flex-col overflow-x-hidden  justify-between'>
          {messages.map((item,index)=>(
            <div key={ulid()} className={`flex items-center space-x-4 ${item.type==="user" && 'ml-auto'}`}>
             {item.type!=="user" &&<div className='bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center'>
                <p>MG</p>
              </div>}
            <div className={` w-[400px] flex-wrap rounded-lg text-white text-sm px-5 py-3 my-5 ${item.type==="user"?"bg-blue-500 ":"  bg-green-500"}`}>
              {item.type!=="user"?
              <div dangerouslySetInnerHTML={{__html: item.message}}></div>:
               <p>{ item.message}</p>
               }
             
            </div>
            {item.type==="user" &&<div className='bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center'>
                <p>ME</p>
              </div>}
            </div>
          ))}

          <div className=' mt-40'>
            <form onSubmit={onSendQuery}>
            <input
            type="text"
            name="query"
            placeholder="Enter query message"
            value={query}
            className={'h-[50px] rounded-lg px-4 w-[30vw]'}
            onChange={(e) => setquery(e.target.value)}
          />
          <input  className='text-white bg-blue-400 p-5 py-3 ml-5 rounded-md cursor-pointer' type="submit" value="Send" />
            </form>
          </div>
      </div>
    )
   }

  return (
    <>
      <Head>
        <title>OPEN AI AND PINECONE SEMANTIC SEARCH</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     <main className={'bg-primary font-sans  flex flex-col md:flex-row items-center justify-center p-20 space-x-10'}>
        <div className='bg-white p-10 rounded-lg shadow-md w-[100%] md:w-1/2'>
            <p className='text-primary  font-semibold tracking-tighter text-2xl'>SALES <span className='font-bold'>ASSIST</span></p>

            <p className='text-gray-600 my-8'>
            An advanced ChatGPT experience for your business, AccentAssist gives your team superpowers
            </p>

            <div className='mt-3 flex text-gray-600 items-center space-x-5'>
              <CheckIcon/>
              <p>Instant access to critical company knowledge</p>
            </div>
            <div className='mt-3  text-gray-600 flex  items-center space-x-5'>
            <CheckIcon/>
              <p>helpful assistant that understands your business</p>
            </div>
            <div className='mt-3 flex  text-gray-600 items-center space-x-5'>
            <CheckIcon/>
              <p>Easy to get started quickly</p>
            </div>

            <p className='mt-10  text-gray-600 '>Instantly make everyone on your team more productive, giving them more time to spend with prospects and customers.</p>
        
            <div className='h-[0.5px] bg-slate-400 w-[100%] my-10'></div>
           
           {activePage==="chat"? <div>
              <p className='font-bold mb-3'>To Add Knowledge base to your chatbot assistant</p>
              <p 
              onClick={()=>setactivePage("knowledgebase")}
              className='text-blue-400 font-semibold cursor-pointer'>Visit here</p>

            </div>:
              <p 
              onClick={()=>setactivePage("chat")}
              className='text-blue-400 font-semibold cursor-pointer'>Visit Chat</p>
            
            }
        </div>
        <div>
            {activePage==="chat"? renderChat():renderKnowledgeBase()}
        </div>

      
      </main>
    </>
  )
}
