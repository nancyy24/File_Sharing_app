
import Quill from "quill";
import "quill/dist/quill.snow.css"
import React, { useEffect, useState } from "react";
import "../app.css"
import {io} from "socket.io-client"
import { useParams } from "react-router-dom";

let toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['link', 'image'],
  
    ['clean']                                         // remove formatting button
  ];

function Writer ()
{
    let [socket,setSocket] = useState()
    let [quill,setQuill] = useState()
    let {id} = useParams();

    useEffect(()=>
    {
        const quillserver = new Quill("#container",{theme : 'snow', modules : {toolbar : toolbarOptions}})
        setQuill(quillserver);
       
      },[]);
    
        useEffect(()=>{
          const socketserver = io("http://localhost:3001");
          setSocket(socketserver);
          return () => {
          socketserver.disconnect();
  
          
          }
        },[])
      // socket.emit is used to send events between the server and the client.
      useEffect(()=>{
         const datachange = (delta,oldData,source)=>{
          if (source === 'api') {
            console.log("An API call triggered this change.");
            return ;
          } else if (source === 'user') {
            console.log("A user action triggered this change.");
            socket && socket.emit('send-changes',delta);
          }
          
         }
         quill && quill.on("text-change",datachange);
          
          return () => {
            quill && quill.off('text-change',datachange);
          }
      },[quill,socket])

      useEffect(()=>{
        const datachange = (delta)=>{
           quill.updateContents(delta);
        
        }
        socket && socket.on("receive-changes",datachange);
         
         return () => {
           quill && quill.off('receive-changes',datachange);
         }
     },[quill,socket])
    
     useEffect(()=>{

      socket && socket.once("load-document",document =>{
        quill && quill.setContents(document);
        quill && quill.enable();
      })
      socket && socket.emit('get-document',id);


   },[quill,socket,id])
      // useEffect(()=>
      // {
      //   const socket = io("http://localhost:3001");
      //   return () => {
      //     socket.disconnect();
      //   }
      // },[]);



    return<>
    <div>
    <h1 className="heading"> 📂Shareable File 📂</h1>
    <div id="container"  className="styling" ></div>
    </div>
 </>
}

export default Writer;