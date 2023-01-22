import React, {useState, useEffect, useContext} from 'react';
import api from '../services/api';
import UserContext from '../UserContext';
import '../select.css';
import {Container, Form, Button, Col, Row, Modal} from 'react-bootstrap';
// import blobStorage from '../services/azureBlobStorage';
import { BlockBlobClient, BlobServiceClient } from '@azure/storage-blob';
import LoadingSpinner from "../components/LoadingSpinner";
import { Link, Redirect, Navigate, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Label = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}));

const Album = () => {
    
    const[photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [author, setAuthor] = useState([]);
    const [album, setAlbum] = useState([]);
    const {userInfo, setUserInfo} = useContext(UserContext);
    const [selectedPhotos, setSelectedPhotos] = useState([]);

    const [showEditAlbum, setEditAlbumShow] = useState(false);
    const [showDeleteAlbum, setDeleteAlbumShow] = useState(false);
    const handleCloseEditAlbum = () => setEditAlbumShow(false);
    const handleCloseDeleteAlbum = () => setDeleteAlbumShow(false);
    const handleOpenEditAlbum = () => setEditAlbumShow(true);
    const handleOpenDeleteAlbum = () => setDeleteAlbumShow(true);

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const album_id = useParams().album_id;
    let {user, logoutUser} = useContext(AuthContext);
    
    const deleteAlbum = () => {
        console.log("delete album")
    }

    const editAlbum = async(e) => {
        e.preventDefault();

        let albumName = e.target.albumName.value;
        let description = e.target.description.value;
        let photosToDelete = selectedPhotos;

        const formData = new FormData();
        formData.append("name", albumName);
        formData.append("description", description);
        formData.append("photosToDelete", photosToDelete);


            try {
                const response = await axios({
                  method: "post",
                  url: "http://localhost:8000/api/edit_album/"+ album.id,
                  data: formData,
                  headers: { "Content-Type": "multipart/form-data" },
                }).then(res => {
                    setMessage(res.data.message);
                    setShow(true);
                    getAlbumPhotos();
                    handleCloseEditAlbum();

                }).catch(errorResponse => {
                    setMessage(errorResponse.data.message);
                    setShow(true);
                })

              } catch(error) {
                setMessage(error);
                setShow(true);
              }

    }



    const getAlbumPhotos  = async() => {
        
        api.get(`/photos_by_album/${album_id}`)
        .then(res => {
            setIsLoading(true);
            setPhotos(res.data.photos);
            setAuthor(res.data.author);
            setAlbum(res.data.album);
            setIsLoading(false);
        })
        .catch(error => {
            console.log(`error ${error}`)
        });
    };

    const handlePhotoCheck = async(e) => {
        if(e.target.checked === true){
            // setSelectedPhotos(selectedPhotos.push(e.target.value));
            setSelectedPhotos((selected) => [
                ...selected,
                e.target.value
            ])
            console.log(e.target.checked, e.target.value);
        }else{
            setSelectedPhotos((selected) => selected.filter(
                (selectedPhoto) => selectedPhoto!=e.target.value
            )
            )
        }
        
       
    }
    useEffect(() => {
        getAlbumPhotos();
    }, [])

    
    const loadPhotos = (
        <Box sx={{ minWidth: 100, minHeight: 100 }}>
        <Masonry columns={3} spacing={2}>
            {photos.map((photo, index) => (
            <div key={index} className="photoBox">
                <Link to={{pathname: `/photo/${photo.id}`}} >
                    <img className="photoThumbnail card-v" src={'https://sqlvauguulxb3vhptc.blob.core.windows.net/photobook/'+photo.photo}/>
                </Link>
                {photo.tag.length > 0 ? <div className='tagBadge'>#{photo.tag[0].name}</div> : ''}
            </div>
            ))}
        </Masonry>
        </Box>
    )
    return(
        <Container>
            <Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>
            
            <Modal show={showDeleteAlbum} onHide={handleCloseDeleteAlbum} dialogClassName="addDialog" contentClassName='addDialogContent'>
            <Modal.Header closeButton>
                <h4 className='pageHeader'>Usun album</h4>
                </Modal.Header>
                <div className="dialogContainer">
                <Modal.Body>
                    Czy na pewno chcesz usunąć album?
                    <br/>
                    <br/>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="deleteAllPhotos" id="flexRadioDefault1" />
                        <label class="form-check-label" for="flexRadioDefault1">
                            Usuń także wszystkie zdjęcia znajdujące się w albumie.
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={deleteAlbum}>
                    Tak
                </Button>
                </Modal.Footer>
                </div>
            </Modal>
            
            <Modal show={showEditAlbum} onHide={handleCloseEditAlbum} dialogClassName="addDialog" contentClassName='addDialogContent'>
            <Modal.Header closeButton>
                <h4 className='pageHeader'>Edytuj album</h4>
                </Modal.Header>
                <div className='dialogContainer'>
                <Container>
                <Form onSubmit={editAlbum}> 
                    <Row>
                        <Col xs={{span:12}}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            </Form.Group>
                            <Form.Group>
                            <Form.Label><b className='pageHeader'>Nazwa albumu</b></Form.Label>
                                <Form.Control as="textarea" name="albumName" rows={1} required >
                                {album.name}
                                </Form.Control>
                            </Form.Group>
                            <br />
                            <Form.Group>
                            <Form.Label><b className='pageHeader'>Opis</b></Form.Label>
                                <Form.Control as="textarea" name="description" rows={3} required > 
                                {album.description}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        {/* <Col xs={{span:3}}> */}
                        {photos.length > 0 ? (
                            <Form.Group>
                            <br/>
                        <Form.Label><b className='pageHeader'>Zdjecia w wybranym albumie</b></Form.Label>
                            <div className='albumsBox'>
                            <table class="table">
                                <thead>
                                    <tr>
                                    <th scope="col"></th>
                                    <th scope="col"><center>Usuń</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        photos.length > 0 ? (
                                            photos.map((photo, index) => {
                                                return(
                                                <tr>
                                                <td style={{width: '80%'}}>
                                                    <img className="miniPhoto" src={'https://sqlvauguulxb3vhptc.blob.core.windows.net/photobook/'+photo.photo}/>
                                                </td>
                                                <td>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" name="selectedPhoto" onChange={handlePhotoCheck} value={photo.id} id="flexCheckDefault" style={{marginRight: 'auto', marginLeft:'auto'}} />
                                                </div>
                                                </td>
                                                </tr>
                                                )
                                            })
                                        ) : ('')
                                    }
                                </tbody>
                                </table>
                            </div>
                        </Form.Group>
                        ) : ('')}
                    
                        <br/><br/><br/><br/>
                        <div className="formGroup">
                            <button type="submit" className='formButton right'>
                                Zadwierdź
                            </button>
                        </div>
                    </Row>
                    </Form>
                </Container>
                </div>
            </Modal>
            <div className='box'>
                <center><h2 className="pageHeader">Album <i>{album.name}</i> uzytkownika {author.username} </h2></center> 
                <p className="textLeft">Opis: {album.description} </p>
                {(user) && (user.id == author.id) ? (
                <div>
                    
                    <div class="form-group btnBox">
                        <button onClick={handleOpenEditAlbum} className='formButton right marginHor'>
                        <small>Edytuj</small>
                        </button>
                        <button onClick={handleOpenDeleteAlbum} className='formButton right marginHor'>
                            <small>Usun</small>
                        </button>
                    </div>
                </div>
                ) : ('')}
                {isLoading ? <LoadingSpinner/> : photos.length > 0 ? (
                    loadPhotos
                ): (
                    <i>Brak zdjęć w wybranym albumie.</i>
                )}
            </div>
            </Row>
            <br/>
        <script src="https://cdn.jsdelivr.net/npm/masonry-layout@4.2.2/dist/masonry.pkgd.min.js" integrity="sha384-GNFwBvfVxBkLMJpYMOABq3c+d3KnQxudP/mGPkzpZSTYykLBNsZEnG2D9G/X/+7D" crossorigin="anonymous" async></script>

        </Container>
        
    )
}
export {Album};