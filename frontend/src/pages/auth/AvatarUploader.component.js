import { Component } from "react";
import Avatar from "react-avatar-edit";


class AvatarUploader extends Component {

  constructor(props) {
    super(props)
    this.state = {
      avatar: null,
      avatarSrc: null
    }
    this.onCrop = this.onCrop.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this)
  }

  onClose() {
    this.setState({avatar: null})
    if (this.props.onCrop) this.props.onCrop(null);
  }

  onCrop(preview) {
    this.setState({avatar: preview})
    if (this.props.onCrop) this.props.onCrop(preview);
  }

  onBeforeFileLoad(elem) {
    if(elem.target.files[0].size > 71680){
      alert("File is too big!");
      elem.target.value = "";
    }
  }

  render () {
    return (
      <div>
        <Avatar
          width={400}
          height={300}
          onCrop={this.onCrop}
          onClose={this.onClose}
          onBeforeFileLoad={this.onBeforeFileLoad}
          src={this.state.avatarSrc}
        />
        {this.state.avatar && <img src={this.state.avatar} alt="Preview" />}
      </div>
    )
  }
}

export default AvatarUploader;