import React from 'react';
import {View,Text,Image,Platform} from 'react-native';
import * as ImagePicker  from  "expo-image-picker";
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component{
    state = {
      image : null  
    }

     getPermissionAsync = async()=>{
      if(Platform.OS !== "web"){
        const{status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)

      }
     
      if(status !== "granted"){
        alert("Sorry, we need camera roll permission to make this work!")  
      } 
     }
      
     componentDidMount=()=>{
        this.getPermissionAsync()  
      }

     _PickImage=async()=>{
        try{
         let result = await ImagePicker.launchImageLibraryAsync({
            mediatypes: ImagePicker.MediaTypeOptions.All,
            allowEditing : true,
            aspect :[4,3],
            quality: 1
        }) 
        if(!result.cancelled){
          this.setState({image: result.data})  
          this.uploadImage(result.uri)
        }
        }
        catch(E){
           console.log(E) 
        }
    }

    uploadImage = async (uri) => {
        const data = new FormData();
        let filename = uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const fileToUpload = {
          uri: uri,
          name: filename,
          type: type,
        };
        data.append("digit", fileToUpload);
        fetch("http://83fa7550f404.ngrok.io/predict-alphabet", {
          method: "POST",
          body: data,
          headers: {
            "content-type": "multipart/form-data",
          },
      })
      .then((response)=>response.json())
      .then((result)=>{
        console.log("success",result)  
      })
        .catch((error)=>{
          console.error("error",error)  
        })      
    
    }

    render(){
     let{image} = this.state
     return(
      <View style={{flex: 1,alignItems: 'center',justifyContent:'center'}}>
        <Button 
          title = "Pick an Image from the camera roll"
          onPress = {this._PickImage}
        />  
      </View>   
     )   
    }
}