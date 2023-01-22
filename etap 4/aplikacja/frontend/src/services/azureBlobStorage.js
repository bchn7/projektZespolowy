import {createContext, useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import { BlockBlobClient, BlobServiceClient } from '@azure/storage-blob';

const blobStorage = (url) => {

//const [imgSrc, setImgSrc] = useState<string>("");

const account = "sqlvauguulxb3vhptc";
const sas = "sp=racw&st=2023-01-15T09:26:54Z&se=2023-02-15T17:26:54Z&sv=2021-06-08&sr=c&sig=OXwIj48RtKi2tRxfZ5%2F%2FmcYhngx4ReIgx192SZllwOE%3D";
const containerName = "photobook";

const blobServiceClient = new BlobServiceClient(`https://sqlvauguulxb3vhptc.blob.core.windows.net/?sv=2021-06-08&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2023-01-15T19:38:50Z&st=2023-01-15T11:38:50Z&spr=https&sig=KFv793fNFLeOOkzb9qtCknqzddoM7YmtZYmLi7ZIzC4%3D`)
// const blobServiceClient = new BlobServiceClient(`https://sqlvauguulxb3vhptc.blob.core.windows.net/photobook?sp=racw&st=2023-01-15T09:26:54Z&se=2023-02-15T17:26:54Z&sv=2021-06-08&sr=c&sig=OXwIj48RtKi2tRxfZ5%2F%2FmcYhngx4ReIgx192SZllwOE%3D`);

async function getImage(url) {
  const blobName = url;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  // Get blob content from position 0 to the end
  // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
  const downloadBlockBlobResponse = await blobClient.download();
  const blob = await downloadBlockBlobResponse.blobBody;
  if (blob){
    //setImgSrc(URL.createObjectURL(blob));
    console.log("Downloaded blob content", blob);
    return URL.createObjectURL(blob);
  }
  console.log("something wrong");
}
    
    return getImage(url);
};

export default blobStorage;