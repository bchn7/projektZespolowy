import React, {useState, useEffect, useContext,} from 'react';
import api from '../services/api';
import UserContext from '../UserContext';
import '../select.css';
import LoadingSpinner from "../components/LoadingSpinner";
import {Container, Form, Button, Col, Row, Modal} from 'react-bootstrap';
import { useNavigate, useParams , Link} from 'react-router-dom';

const SearchBy = () => {
    
    const [isLoading, setIsLoading] = useState(true);

    const[photos, setPhotos] = useState([]);

    const[criterium, setCriterium] = useState(useParams().criterium);
    const[value, setValue] = useState(useParams().value);

    // modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [message, setMessage] = useState([]);


    const getPhotosByCriterium  = async(criteriumParam, valueParam) => {
        setIsLoading(true);
        api.get(`/photos/by_criterium/${criteriumParam}/${valueParam}`)
        .then(res => {
            setPhotos(res.data.photos);
            if(res.data.status_code == 200){
                setPhotos(res.data.photos);
            } else setPhotos('');

            setIsLoading(false)
        })
        .catch(error => {
            console.log(`error ${error}`)
        });
    };  

    const searchBy = async(e) =>{
        e.preventDefault();

        setCriterium(e.target.criterium.criterium);
        setValue(e.target.searchValue.value);
        
        getPhotosByCriterium(e.target.criterium.value, e.target.searchValue.value);

    }

    const colSizes = [5, 4, 3, 5, 4, 3, 5, 4, 3, 5, 4, 3, 5, 4, 3, 5, 4, 3];

    

    const loadPhotos = (
        
        <Container>
            <center><h2 className="pageHeader">Szukaj `{value}` po:{criterium}</h2></center>
                    <Row>
                    {   
                        
                        photos.length > 0 ? (
                            photos.map((photo, index) => {
                                return(
                                    
                                <Col xs={{span: colSizes[index]}}>
                                    <div className='photoBox'>
                                    <Link to={{pathname: `/photo/${photo.id}`}} >
                                        <img className="photoThumbnail" src={'https://sqlvauguulxb3vhptc.blob.core.windows.net/photobook/'+photo.photo}/>
                                        </Link>
                                        {photo.tag.length > 0 ? <div className='tagBadge'>#{photo.tag[0].name}</div> : ''}
                                    </div>
                                </Col>
                                )
                            }) 
                        ) : <i>Nie znaleziono zdjec o podanych kryteriach</i>
                    }
                    </Row>
        </Container>
    )

    useEffect(() => {
        getPhotosByCriterium(criterium, value);
    }, [])

    

    return(
        <Container>
          <Row>
          <div className='searchOptionsBox'>
                <form onSubmit={searchBy}>
                <div className="input-group mb-3 center">
                <select className="minimal" name="criterium">
                    <option disabled selected>Wyszukaj po</option>
                    <option value="tag">Tag</option>
                    <option value="author">Użytkownik</option>
                    <option value="title">Tytuł</option>
                </select>
                <input type="text" name="searchValue" className="form-control searchInput" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="submit">Szukaj</button>
                </div>
                </div>
                </form>
            </div>
            <div className='box'>
                
                {isLoading ? <LoadingSpinner/> : loadPhotos }

            </div>
          </Row>
        </Container>
    )
}
export {SearchBy};