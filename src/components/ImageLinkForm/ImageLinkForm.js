import react, { Component } from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputchange, onButtonsubmit}) => {
    return(
        <div>
            <p className='f3'> {'This Magic Brain will detect faces in your pictures.Git it a try !'} </p>
            <div className='center'>
                <div className='center form pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' type='text' onChange={onInputchange} ></input>
                    <button className='f4 grow w-30 link ph3 pv2 dib white bg-light-purple' onClick={onButtonsubmit}>Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;