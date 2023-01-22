import React, {useState, useContext, useEffect} from "react";
import {Container, Form, Button, Col, Row, Modal} from 'react-bootstrap';
import {useNavigate, Link, useParams} from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import '../App.css';
import AuthContext from '../context/AuthContext'
import LoadingSpinner from "../components/LoadingSpinner";
import qs from 'querystring';

const Photo = () => {

    const [isLoading, setIsLoading] = useState(true);
    const[photo, setPhoto] = useState([]);
    const[tags, setTags] = useState([]);
    const[tagNames, setTagNames] = useState([]);
    const[comments, setComments] = useState([]);
    const[photoFavourite, setPhotoFavourite] = useState();

    const[userOwner, setUserOwner] = useState(null);


    // modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [message, setMessage] = useState([]);

    // user
    let {user, logoutUser} = useContext(AuthContext);

    const[albums, setAlbums] = useState([]);
    const [showEditPhoto, setEditPhotoShow] = useState(false);
    const [showDeletePhoto, setDeletePhotoShow] = useState(false);
    const handleCloseEditPhoto = () => setEditPhotoShow(false);
    const handleCloseDeletePhoto = () => setDeletePhotoShow(false);
    const handleOpenEditPhoto = () => setEditPhotoShow(true);
    const handleOpenDeletePhoto = () => setDeletePhotoShow(true);

    const[author, setAuthor] = useState([]);


    const id = useParams().id;

    const navigate = useNavigate();


    const isPhotoFavourite = async() => {
        if (user){
            api.get(`/photo_favourite/${id}/${user.id}`)
        .then(res => {
            setPhotoFavourite(res.data);
            console.log(res.data);
            
        })
        .catch(error => {
            console.log(`error ${error}`)
        });
        }
    };

    const getPhoto = async() => {
        api.get(`/get_photo/${id}`)
        .then(res => {
            console.log(res.data.photo);
            setPhoto(res.data.photo);
            setTags(res.data.photo.tag);
            setAuthor(res.data.photo.author);
            setIsLoading(false);
        })
        .catch(error => {
            console.log(`error ${error}`)
        });
    };

    const getUserAlbums = async() => {
        api.get(`/albums/${user.id}`)
        .then(res => {
            setAlbums(res.data.albums);
        })
        .catch(error => {
            console.log(`error ${error}`)
        });
    };

    const getComments = async() => {
        api.get(`/get_comments/${id}`)
        .then(res => {
            console.log(res.data.comments);
            setComments(res.data.comments);
        })
        .catch(error => {
            console.log(`error ${error}`)
        });
    };
    
    useEffect(() => {
        getPhoto();
        getComments();
        isPhotoFavourite();
        getUserAlbums();

    }, []);

    let addComment = async (e)=> {
        e.preventDefault();
        console.log(e.target.comment.value);

        if (e.target.comment.value == ''){
            setMessage("Nie możesz dodać pustego komentarza");
            setShow(true);
            return
            
        }

            console.log("USER ID", user.id);
            api.post(`/add_comment/${id}`, qs.stringify({comment: e.target.comment.value, user_id: user.id}))
            .then(res => {
                setMessage(res.data.message);
                setShow(true);
                getComments();
                e.target.comment.value = '';
    
            }).catch(error => {
                setMessage(error);
                setShow(true);
            })
        
    }

    const handleFavourite = () => {
        var newFavourite;

        if(photoFavourite){
            newFavourite = 0
        }else newFavourite = 1;
        
        api.get(`/manage_favourite/${id}/${user.id}/${newFavourite}`)
            .then(res => {
                setMessage(res.data.message);
                setShow(true);
                isPhotoFavourite();
    
            }).catch(error => {
                setMessage(error);
                setShow(true);
            })
    }

    const loadPhoto = (
        
        <div className="parent" key={photo.id}>
        <Row>
        <Col xs={{span:12}}>
        <h2 className="pageHeader">
        {photo.title} 
        <button className="gold" data-tooltip="Dodaj do ulubionych" data-tooltip-position="bottom" onClick={handleFavourite}>
        {user ? (
            photoFavourite ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16" >
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                </svg>
            )
            
        ) : ''}
        
        </button>
        </h2>
        </Col>   
        <Col xs={{span:8}}>
        <div className="colorBase left">
        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
        </svg>
        <Link to={{pathname: `/galeria/${author.id}`}} >
                    <p>{author.username}</p>
        </Link>
        </div>
        <div className="addInfoBox right">
            <small>Dodano: {new Date(photo.created_at).toLocaleDateString()}</small> <br/>
            <small>Zaktualizowano: {new Date(photo.updated_at).toLocaleDateString()}</small>
        </div>
        
        <img src={'https://sqlvauguulxb3vhptc.blob.core.windows.net/photobook/'+photo.photo} width="100%" alt="Responsive image"/>
        </Col>
        <Col xs={{span:4}}>
            <h3 className="pageHeader baseLine"> Komentarze</h3>
            {
                comments.length > 0 ? (
                    comments.map(comment => {
                        return(
                            <div className="commentBox">
                                <div className="commentHeader">
                                    <div className="left"><b>{comment.user.username}</b> <br/></div>
                                    <div className="right"><small>{new Date(comment.created_at).toLocaleDateString()}</small></div>
                                </div> <br/>
                                <small>{comment.comment}</small>
                            </div>
                        )
                    })
                    
                ) : ("Brak komentarzy do tego zdjęcia.")
            }
            {user ? (
                <form onSubmit={addComment}>
                <hr/>
                <div class="form-group">
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" name="comment" placeholder="Dodaj komentarz"></textarea>
                </div>
                <div className="btnBox">
                <button type="submit" class="btn btn-light right">Zatwierdź</button>
                </div>
                </form>
            ) : ''}
        </Col>
        <Col xs={{span:8}}>
            {
                userOwner ? (
                    <div class="form-group btnBox">
                        
                        <button type="submit" class="btn btn-light left marginHor" onClick={handleOpenEditPhoto}>Edytuj</button>
                        <button type="submit" class="btn btn-light left marginHor" onClick={handleOpenDeletePhoto}>Usuń</button>
                    </div>
                ) : ('')
            }
            <br/>
            <h3 className="pageHeader baseLine"> Tagi</h3>
            {   
                tags.length > 0 ? (
                    tags.map(tag => {
                        return(
                            <div className="tagBox">
                            <div key={tag.id} className="tag">
                                #{tag.name}
                            </div>

                            </div>
                        )
                    })
                ) : ("Te zdjecie nie zawiera tagow.")
            }
            
        </Col>
        <Col xs={{span:8}}>
            <h3 className="pageHeader baseLine"> Opis</h3>
            <p>{photo.description}</p>
            
        </Col>
        </Row>
        </div>
        
    )


    useEffect(() =>{
        if ((user) && (isLoading == false)){
            if (user.id == photo.author.id){
                setUserOwner(true);
            } else setUserOwner(false);
        }
        parseTags();
    });

    const editPhoto = async(e) => {
        e.preventDefault();

        let description = e.target.description.value;
        let photoName = e.target.photoName.value;
        let tags = e.target.tags.value;
        let selectedAlbum = e.target.album.value;
        let newAlbum = e.target.newAlbum.value;
        
        
            const formData = new FormData();
            formData.append("name", photoName);
            formData.append("description", description);
            formData.append("tags", tags);
            formData.append("selectedAlbum", selectedAlbum);
            formData.append("newAlbum", newAlbum);
            formData.append("user_id", user.id);

            try {
                const response = await axios({
                  method: "post",
                  url: "http://localhost:8000/api/edit_photo/" + photo.id,
                  data: formData,
                  headers: { "Content-Type": "multipart/form-data" },
                }).then(res => {
                    getPhoto()
                    setMessage(res.data.message);
                    setShow(true);
                    handleCloseEditPhoto();
                })
              } catch(error) {
                setMessage(error);
                setShow(true);
              }
    }
    
    const parseTags = () => {

        let tagsString = [];
        console.log("TAGS:");
        console.log(tags);
        if (tags.length > 1){
            tags.forEach(tagInstance => {
                console.log(tagInstance);
                tagsString.push(tagInstance.name);
            });

            setTagNames(tagsString.join(", "));

        } else tagsString = tags.name;

        
    }

    const deletePhoto = async() => {
        api.get(`/delete_photo/${photo.id}`)
        .then(res => {
            navigate('/');
        })
        .catch(error => {
            setMessage(error);
            setShow(true);
        });
    }
    return(
        <Container>
            <Row>
            <Modal show={showDeletePhoto} onHide={handleCloseDeletePhoto}>
            <Modal.Header closeButton>
                <h4 className='pageHeader'>Usun zdjecie</h4>
                </Modal.Header>
                <Modal.Body>
                    Czy na pewno chcesz usunąć zdjęcie?
                    
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={deletePhoto}>
                    Tak
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showEditPhoto} onHide={handleCloseEditPhoto} dialogClassName="addDialog" contentClassName='addDialogContent'>
            <Modal.Header closeButton>
                <h4 className='pageHeader'>Edytuj zdjecie</h4>
                </Modal.Header>
                <div className='dialogContainer'>
                <Container>
                <Form onSubmit={editPhoto}> 
                    <Row>
                        <Col xs={{span:12}}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <center>
                            </center>
                            </Form.Group>
                            <Form.Group>
                            <Form.Label><b className='pageHeader'>Nazwa zdjęcia</b></Form.Label>
                                <Form.Control as="textarea" name="photoName" rows={1} required >
                                {photo.title}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group></Form.Group>
                            <Form.Group>
                            <Form.Label><b className='pageHeader'>Opis</b></Form.Label>
                                <Form.Control as="textarea" name="description" rows={3} required > 
                                {photo.description}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <br/>
                            <Form.Label><b className='pageHeader'>Tagi</b></Form.Label>
                                <Form.Control as="textarea" name="tags" rows={1}>{tagNames}</Form.Control>
                        </Form.Group> 
                        </Col>
                        <Col xs={{span:3}}>
                        <Form.Group>
                            <br/>
                        <Form.Label><b className='pageHeader'>Wybierz album</b></Form.Label>
                            <div className='albumsBox'>
                                {
                                    albums.length > 0 ? (
                                        albums.map((album) => {
                                            return(
                                                    <div class="form-check">
                                                    {
                                                    (photo.album != undefined) && (photo.album.length > 0) && (album.id == photo.album[0].id) ? (
                                                        <input class="form-check-input" type="radio" name="album" value={album.id} id="flexRadioDefault1" checked/>
                                                    ) : (
                                                        <input class="form-check-input" type="radio" name="album" value={album.id} id="flexRadioDefault1" />
                                                    )
                                                    }
                                                    <label class="form-check-label" for="flexRadioDefault1">
                                                        {album.name}
                                                    </label>
                                                </div>
                                            )
                                            })
                                    ) : (<i>Nie posiadasz żadnych albumów.</i>)
                                }
                            </div>
                        </Form.Group>
                        </Col>
                        <br/>
                        <Col xs={{span:4}}>
                        <Form.Group>
                                <br/>
                            <Form.Label><b className='pageHeader'>Stworz nowy album</b></Form.Label>
                                <Form.Control as="textarea" name="newAlbum" rows={1} placeholder="Podaj nazwę albumu"/>
                        </Form.Group>
                        </Col>
                        <br/><br/><br/><br/>
                        <div className="formGroup">
                            <button type="submit" className='formButton right'>
                                Dodaj
                            </button>
                        </div>              
                    </Row>
                    </Form>
                </Container>
                </div>
            </Modal>
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
                <Col xs={{span: 12}}>
                    <div className="logoContainer">
                        <div className="box">
                            
                            <Row>
                            
                            {
                                isLoading ? <LoadingSpinner /> : loadPhoto
                            }

                            </Row>
                            
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
        );

   
}

export {Photo};