import { Component } from "react"
import { Searchgbar } from "./SearchBar"
import {ImageGallery} from './ImageGallery'
import LoadMoreBtn from "./LoadMoreBtn"
import { Modal } from "./Modal"
import { ToastContainer } from "react-toastify"
export class App extends Component {
  state={
    imageName : null,
    page: 1,
    images: [], 
    isOpen: false,
    largeImageURL: null, 
    status: 'idle'
  }
  onChangeStatus=(statusImage)=>{
this.setState(
  {status: statusImage}
)
  }
  openImageModal = (largeImageURL)=>{
this.setState({
  largeImageURL,
  isOpen: true
})
  }
 onClose = ()=>{
  this.setState({
 isOpen: false
  })
 }
  componentDidUpdate(prevProps , prevState) {
    
    if (prevState.imageName !== this.state.imageName) {
      this.setState({status: 'pending'})
      fetch(
        `https://pixabay.com/api/?q=${this.state.imageName}&page=1&key=39772829-b06ea6d2025ce0b1560a85913&image_type=photo&orientation=horizontal&per_page=12`
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState({ images: data.hits, status:'resovled' });
        });
      
    }
   
  }

  imageOnChange=(name)=>{
this.setState({imageName: name})
  }

  onLoadMore = ()=>{
this.setState((prevState)=>{return{page: prevState.page + 1 }})
fetch(
  `https://pixabay.com/api/?q=${this.state.imageName}&page=${this.state.page}&key=39772829-b06ea6d2025ce0b1560a85913&image_type=photo&orientation=horizontal&per_page=12`
)
  .then((response) => response.json())
  .then((data) => {
    this.setState((prevState)=>{ return{  images: [...prevState.images, ...data.hits] }});
  });
  }
 render(){
  const {status, images, largeImageURL } = this.state

  return(
    <div  className="App">
      
  <Searchgbar onSubmit={this.imageOnChange}/>

      <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>

<ToastContainer />
<ImageGallery  status={status} openImageModal={this.openImageModal}  images={images}/>
{this.state.isOpen && <Modal largeImageURL={largeImageURL}  onClose={this.onClose}/>}
<LoadMoreBtn onClick={this.onLoadMore}/>

    </div>
  )
 }
    }