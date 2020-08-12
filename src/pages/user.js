import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../components/index.css';
import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;
 
class User extends Component {
	constructor(props) {
		super(props);
		this.state = {
			walletId:''
			
		}
	}
	async componentDidMount() {
		//console.log("here:"+this.props.match.url);
		await this.loadData();
	}
	
	async loadData() {
		// TODO handle errors
		this.setState({walletId:this.props.match.url.split("/user/")});
	
		//  const { txId } = this.props;
		//   const { user, post } = await loadPost(txId);
		//    const commentsData = await loadComments(txId);

		//   this.setState({ isLoaded: true, post, user, commentsData });
	} 
	
	render(){
		return (
			<div>
				<p>user: {this.state.walletId[1]}</p>
				<p>More information and features for user page in next release</p>
			</div>	
		);
	}
}
export default User;
