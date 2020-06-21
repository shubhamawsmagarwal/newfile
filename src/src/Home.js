import React, { Component } from 'react';
import { Link } from 'react-router-dom';
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }); // leaving out the arguments will default to these values
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buffer: null,
      loading:false
    };
  }
  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result)});
      //console.log('buffer', this.state.buffer)
    };
  }
  onSubmit = (event) => {
    event.preventDefault();
    const p=parseFloat(this.imagePrice.value);
    if(p<0){
      alert("can't be negative");
      return;
    }
    const price = window.web3.utils.toWei(this.imagePrice.value.toString(), 'Ether');
    //console.log("Submitting file to ipfs...")
    this.setState({ loading:true });
    ipfs.add(this.state.buffer, (error, result) => {
      //console.log('Ipfs result', result);
      if(error) {
        console.error(error);
        return;
      }
       this.props.imageUpload(result[0].hash,price);
    });
  }
  render() {
    if(this.state.loading)
    return(<div className="text-center">Loading...</div>);
    return (
      <div>
        <div className="text-center">
            <p className="font-weight-bold text-secondary">Account:  {this.props.account}</p>
            <Link to="/user" className="btn btn-lg btn-info">Profile</Link>
            <p>&nbsp;</p>
            <h3>Add Image</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  ref={(input) => { this.imagePrice = input }}
                  placeholder="Image Price"
                  required />
              </div>
              <input type='file' onChange={this.captureFile} />
              <button type="submit" className="btn btn-success">Add Image</button>
            </form>
            <p>&nbsp;</p>
            <h2>Buy Image</h2>
            { this.props.images.map((image, key) => {
            if(image.purchased)
              return(null);
              return(
              <div  className="m-3 text-center w-50 p-5" key={key}>
                <div className="img-thumbnail">
                  <img className="w-50 p-3" src={`https://ipfs.infura.io/ipfs/${image.hash}`} alt="description" />
                  <p className="font-weight-bold text-secondary">{window.web3.utils.fromWei(image.price.toString(), 'Ether')} Eth</p>
                  <button
                      name={image.id}
                      value={image.price}
                      className="btn btn-info"
                      onClick={(event) => {
                        this.props.purchaseImage(event.target.name, event.target.value);
                      }}
                    >Buy</button>
                </div>
              </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default Home;











