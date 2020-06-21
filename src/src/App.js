import React, { Component } from 'react';
import {BrowserRouter as Router , Route} from 'react-router-dom';
import Web3 from 'web3';
import './App.css';
import {ABI,ADDRESS } from './config';
import Home from './Home';
import User from './User';
class App extends Component {
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }
  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const currentAccount=accounts[0];
    this.setState({ account: currentAccount });
    const file = new web3.eth.Contract(ABI,ADDRESS);
    this.setState({ file});
    const imageCount = await file.methods.imageCount().call();
    this.setState({ imageCount });
    for (var i = 1; i <= imageCount; i++) {
      const image = await file.methods.images(i).call();
      this.setState({
        images: [...this.state.images,image]
      });
    }
    const userImageCount=await file.methods.userImageCount(currentAccount).call();
    this.setState({userImageCount});
    for (i = 0; i <userImageCount; i++) {
      const index = await file.methods.users(currentAccount,i).call();
      const image=await file.methods.images(index).call();
      this.setState({
        userImages: [...this.state.userImages,image]
      });
    }
    this.setState({ loading: false });
  }
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      imageCount: 0,
      userImageCount:0,
      userImages:[],
      images: [],
      loading: true
    };
    this.imageUpload = this.imageUpload.bind(this);
    this.purchaseImage = this.purchaseImage.bind(this);
  }
  imageUpload(hash,price) {
    this.setState({ loading: true });
    this.state.file.methods.imageUpload(hash, price).send({ from: this.state.account }).then((r) => {
      window.location.reload(false);
    });
  }
  purchaseImage(id, price) {
    this.setState({ loading: true });
    this.state.file.methods.purchaseImage(id).send({ from: this.state.account, value: price }).then((r) => {
      window.location.reload(false);
    });
  }
  render() {
    if(this.state.loading)
    return(<div className="text-center">Loading...</div>);
    return (
    <Router><div>
      <Route exact path="/" render={(props)=>
        <Home {...props} 
        images={this.state.images}
        imageUpload={this.imageUpload}
        purchaseImage={this.purchaseImage}
        account={this.state.account}
        />
      }></Route>
      <Route exact path="/user" render={(props)=>
        <User {...props} 
        account={this.state.account}
        images={this.state.userImages}
        />
      }></Route>
    </div></Router>
    );
  }
}

export default App;