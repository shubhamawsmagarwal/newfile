import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
class User extends Component{
    render(){
        return(
            <div className="text-center">
            <p className="font-weight-bold text-secondary">Account:  {this.props.account}</p>
            <Link to="/" className="btn btn-lg btn-info">Home</Link>
            {this.props.images.map((image, key) => {
                  return(
                  <div  className="m-4 text-center w-50 p-5" key={key}>
                    <div className="img-thumbnail">
                      <img className="w-50 p-3" src={`https://ipfs.infura.io/ipfs/${image.hash}`} alt="description" />
                      {(!image.purchased)
                      ?<p className="font-weight-bold text-secondary">{window.web3.utils.fromWei(image.price.toString(), 'Ether')} Eth</p>
                      :(image.owner===this.props.account)
                      ?<p className="font-weight-bold text-secondary">Bought</p>
                      :<p className="font-weight-bold text-secondary">Sold</p>
                      }
                    </div>
                  </div>
                  );
                })}
            </div>
        );
    }
}
export default User;