pragma solidity ^0.5.0;
contract File{
   string public name;
   uint public imageCount=0;
   mapping(uint=>Image) public images;
   mapping(address=>uint[]) public users;
   mapping(address=>uint) public userImageCount;
   mapping(string=>bool) private hashTable;
   struct Image{
      uint id;
      string hash;
      uint price;
      address payable owner;
      bool purchased;
   }
   event ImageUploaded(uint id,string hash,uint price,address payable owner,bool purchased);
   event ImagePurchased(uint id,string hash,uint price,address payable owner,bool purchased);
   constructor() public{
      name="File";
   }
   function imageUpload(string memory _imageHash,uint _price) public{
      require(bytes(_imageHash).length>0);
      require(_price>0);
      require(hashTable[_imageHash]==false);
      hashTable[_imageHash]=true;
      imageCount++;
      images[imageCount]=Image(imageCount,_imageHash,_price,msg.sender,false);
      users[msg.sender].push(imageCount);
      userImageCount[msg.sender]=users[msg.sender].length;
      emit ImageUploaded(imageCount,_imageHash,_price,msg.sender,false);
   }
   function purchaseImage(uint _id) public payable{
      Image memory _image=images[_id];
      address payable _seller=_image.owner;
      require(_image.id>0 && _image.id<=imageCount);
      require(msg.value>=_image.price);
      require(!_image.purchased);
      require(_seller!=msg.sender);
      _image.owner=msg.sender;
      _image.purchased=true;
      images[_id]=_image;
      users[msg.sender].push(_id);
      userImageCount[msg.sender]=users[msg.sender].length;
      address(_seller).transfer(msg.value);
      emit ImagePurchased(imageCount,_image.hash,_image.price,msg.sender,true);
   }
}