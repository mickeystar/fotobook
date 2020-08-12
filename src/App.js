import React, {Component} from 'react';
//import logo from './logo.svg';
//import './App.css';
import { Route, HashRouter as Router, Switch, NavLink } from "react-router-dom";
import Home from './pages/home';
import About from './pages/aboutus';
import Photo from './pages/photo';
import SearchImage from './pages/search';
import User from './pages/user';

//import 'antd/dist/antd.css';
//import './components/index.css';
import { Layout, Menu, Breadcrumb } from 'antd';
//import { and, equals } from 'arql-ops';
import Arweave from "arweave/web";
import { Upload, message, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { Select } from 'antd';

import { readContract } from 'smartweave'
import { selectWeightedPstHolder } from 'smartweave'

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const arweave = Arweave.init({host: 'arweave.net', port: 443, protocol: 'https'});


//upload image
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class App extends Component {
	constructor()
	{
		super();
		this.state={
			data:'',
			urlphotos:[],
			image_num:'',
			//modal
			loading: false,
			visible: false,
			//upload wallet
			fileList1: [
			],
			wallet:'',
			address:'',
			balance:'',
			//upload image
			previewVisible: false,
			previewImage: '',
			previewTitle: '',
			fileList: [
			],
			image_cat:'General',
			image_desc:'',
		}
	}
	
	componentDidMount(){
	//	const contractId = 'bmE1LfJrLRmZ4mVJpzTiuDi2nZA2hEEyij0mobjzezE';

	//	readContract(arweave, contractId).then(contractState => {
		// contractState is the latest state of the contract.
		// assuming its a PST token, dump all the balances to the console:
		//console.log(contractState.balances);
	//	const holder = selectWeightedPstHolder(contractState.balances);
		//console.log("holder:"+holder);
	//	})
	}
	
	//PST
	sendFee() {
		// Replace this Id with the contract you want to read.
		const contractId = 'bmE1LfJrLRmZ4mVJpzTiuDi2nZA2hEEyij0mobjzezE';

		readContract(arweave, contractId).then(contractState => {
			// contractState is the latest state of the contract.
			// assuming its a PST token, dump all the balances to the console:
			//console.log(contractState.balances);
			const holder = selectWeightedPstHolder(contractState.balances);
			// send a fee. You should inform the user about this fee and amount.
			(async()=>{
				const tx = await arweave.createTransaction({ target: holder, quantity: arweave.ar.arToWinston(0.05) }, this.state.wallet);
				//console.log("send fee");
				await arweave.transactions.sign(tx, this.state.wallet);
				//await arweave.transactions.post(tx);
				const txid = tx.id;
				//console.log("txid:",txid);
				const res = await arweave.transactions.post(tx);
				if(res.status === 200 || res.status === 202) {
					//console.log("success");
					//$file.addClass('success');
					//$file.find('.status').html(`Deployed: <a href="${arweave.api.config.protocol}://${arweave.api.config.host}:${arweave.api.config.port}/${txid}" target="_blank">${txid}</a>`);
				} else {
					// Fail
					//$file.addClass('fail');
					//$file.find('.status').text('Transaction failed.');
					//console.log("fail");
				}	
			})()
		})
	}
	
	//modal
	showModal = () => {
		this.setState({
		visible: true,
		});
	};

	handleOk = () => {
		this.setState({ loading: true });
		setTimeout(() => {
			this.setState({ loading: false, visible: false });
			}, 3000);
		
			//alert(this.state.balance);
			( async () => {
		
			//const temp64str = this.state.previewImage.split("base64,");
			//this.setState({base64str:temp64str[1]});
			//console.log("base64string:"+this.state.base64str);
	//		const data = this.state.base64str;
			//const tempstr = "abcde";
			const tx = await arweave.createTransaction({
			data:Buffer.from(this.state.base64str, 'base64')}, this.state.wallet);
			//data: Buffer.from(this.state.base64str, 'base64')
			//console.log("transaction1:",tx);	
			tx.addTag('App-Name', 'fotobook');
			tx.addTag('App-Version', 'Demo_v1');
			tx.addTag('Content-Type', 'image/jpeg');
			tx.addTag('Category', this.state.image_cat);
			tx.addTag('Image-Desc', this.state.image_desc);


	//		console.log("transaction2:"+transaction);
			
			await arweave.transactions.sign(tx, this.state.wallet);
			const txid = tx.id;
			//console.log("txid:",txid);
			const res = await arweave.transactions.post(tx);
			if(res.status === 200 || res.status === 202) {
				// Success
				//console.log("success");
				this.sendFee();
				//$file.addClass('success');
				//$file.find('.status').html(`Deployed: <a href="${arweave.api.config.protocol}://${arweave.api.config.host}:${arweave.api.config.port}/${txid}" target="_blank">${txid}</a>`);
			} else {
				// Fail
				//$file.addClass('fail');
				//$file.find('.status').text('Transaction failed.');
				//console.log("fail");
			}
		})()
	};

	handleCancel = () => {
		this.setState({ visible: false });
	};
	
	//upload wallet
	handleChange = info => {
		let fileList1 = [...info.fileList];

		// Limit the number of uploaded files
		// Only to show one recent uploaded files, and old ones will be replaced by the new
		fileList1 = fileList1.slice(-1);

		// 2. Read from response and show file link
		fileList1 = fileList1.map(file => {
			if (file.response) {
				// Component will show file.url as link
				file.url = file.response.url;
			}
			return file;
		});

		this.setState({ fileList1 });
	
		//read wallet file
		const fileReader = new FileReader();
		fileReader.onload = async e => {

			this.setState({wallet:JSON.parse(e.target.result)});
			//alert("wallet:"+this.state.wallet);
			this.setState({address:await arweave.wallets.jwkToAddress(this.state.wallet)});
			//alert("address:"+this.state.address);
			const bal = await arweave.wallets.getBalance(this.state.address);
			this.setState({balance:arweave.ar.winstonToAr(bal)});
			//alert("balance:"+this.state.balance);
		};
		fileReader.readAsText(info.file.originFileObj);
	};
	
	
	//upload image
	handleCancel2 = () => this.setState({ previewVisible: false, base64str:"" });

	handlePreview = async file => {
		if (!file.url && !file.preview) {
			//need to check if jpg
			file.preview = await getBase64(file.originFileObj);
		//	alert("test1");
		}
		//	alert("test2");
		this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true,
			previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
		});
	};

	handleChange2 = ({ file,fileList }) => 
	{	
		if (file.status !== 'uploading') {
		//	const files =  getBase64(file.originFileObj);
			//console.log(file, fileList);
			//console.log("filename:"+file.name);
			( async () => {
				const testing1 = await getBase64(file.originFileObj);
				//console.log("testing1:"+testing1);
				const temp64str = testing1.split("base64,");
				this.setState({base64str:temp64str[1]});
				//console.log("2base64string:"+this.state.base64str);
			})()
		}
		if(fileList.length > 0)
		{
			//console.log("not empty");
		}
		//console.log(this.state.previewTitle);
		//console.log(getBase64(fileList.originFileObj));
		//const temp64str = fileList..split("base64,");
		//this.setState({base64str:temp64str[1]});
		//console.log("2base64string:"+this.state.base64str);
		//console.log("testing0");
//		console.log(fileList2.length);
//		if(fileList2[0].status === 'done')
//		{
		
//			console.log("testing");
//		}
		this.setState({ fileList });
	};
	
	//search
	handleClick(value){
		//console.log("debug1:"+value);
		//alert(this.state.imageTxID);	
		window.location.hash="#/search/"+value;
	}
	
	//category
	onChangeS=(value)=> {
		this.setState({image_cat:value});
		//console.log(`selected ${value}`);
	}

	onBlurS() {
		//console.log('blur');
	}

	onFocusS() {
		//console.log('focus');
	}

	onSearchS(val) {
		//console.log('search:', val);
	}

	//description
	onChangeI = e => {
		//console.log(e);
		this.setState({image_desc:e.target.value});
	};
	
	render(){

		//modal
		const { visible, loading } = this.state;
		//upload wallet
		const props = {
			action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
			onChange: this.handleChange,
			multiple: false,
		};
		//upload image
		const { previewVisible, previewImage, fileList, previewTitle } = this.state;
		const uploadButton = (
			<div>
				<PlusOutlined />
				<div className="ant-upload-text">Upload Image Here</div> 
			</div>
		);
		//category
		const { Option } = Select;

	return (
		<Router>
			<Layout>
				<Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}  >
	
				<div className="logo" />
					
					<Search placeholder="Arweave Wallet Address" onSearch={this.handleClick.bind(this)} style={{ width: 400 , float: 'right'}} enterButton />
					
					<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
						<Menu.Item key="1"> Home <NavLink to="/">    
							</NavLink> </Menu.Item>
						<Menu.Item key="2"> About Us <NavLink to="/aboutus">  
							</NavLink></Menu.Item>
					</Menu>

					<Button type="primary" onClick={this.showModal} style={{float: 'right'}}>
						Quick Upload
					</Button>
					
					<Modal
						visible={visible}
						title="Quick Upload Image"
						onOk={this.handleOk}
						onCancel={this.handleCancel}
						footer={[
							<Button key="back" onClick={this.handleCancel}>
								Return
							</Button>,
							<Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
								Submit
							</Button>,
						]}
					>
					
					<p>
						Upload your AR wallet .json file
						<Upload {...props} fileList={this.state.fileList1}>
						<Button>
							<UploadOutlined /> Upload
						</Button>
						</Upload>
							{this.state.balance}
					</p>
				
					<p>
						Upload your image .jpg file
				
						<Upload
							listType="picture-card"
							fileList={fileList}
							onPreview={this.handlePreview}
							onChange={this.handleChange2}
						>
				
							{fileList.length >= 1 ? null : uploadButton}
						</Upload>
						<Modal
							visible={previewVisible}
							title={previewTitle}
							footer={null}
							onCancel={this.handleCancel2}
						>
							<img alt="example" style={{ width: '100%' }} src={previewImage} />
						</Modal>
					</p>
				
					<p>
						Category: 
						<Select
							showSearch
							style={{ width: 200 }}
							placeholder="Select Image Category"
							optionFilterProp="children"
							onChange={this.onChangeS}
							onFocus={this.onFocusS}
							onBlur={this.onBlurS}
							onSearch={this.onSearchS}
							filterOption={(input, option) =>
								option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
						>
							<Option value="General">General</Option>
							<Option value="Portrait">Portrait</Option>
							<Option value="Landscape">Landscape</Option>
							<Option value="Macro">Macro</Option>
							<Option value="Nature/Wildlife">Nature/Wildlife</Option>
							<Option value="Street/Documentary">Street/Documentary</Option>
							<Option value="Sport/Action">Sport/Action</Option>
							<Option value="Astrophotography">Astrophotography</Option>
							<Option value="Digital Art/Abstract">Digital Art/Abstract</Option>
							<Option value="Drone/Aerial Photography">Drone/Aerial Photography</Option>
							<Option value="Food Photography">Food Photography</Option>
						</Select>,
				
					</p>
				
					<p>Description:
						<Input placeholder="Input Image Description" allowClear onChange={this.onChangeI}/>
					</p>
				
					<p>Permission: Public</p>
					
					</Modal>
			
				</Header>
				
				<Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
					<Breadcrumb style={{ margin: '16px 0' }}>
						<Breadcrumb.Item>Home</Breadcrumb.Item>
						<Breadcrumb.Item>List</Breadcrumb.Item>
						<Breadcrumb.Item>App</Breadcrumb.Item>
					</Breadcrumb>
					<div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
						<Route exact path="/" component={Home}/>
						<Route path="/aboutus" component={About}/>
						<Route path="/photo/:txId" component={Photo}/>
						<Route path="/search/:txs" component={SearchImage}/>
						<Route path="/user/:walletId" component={User}/>
					</div>
				</Content>
				
				<Footer style={{ textAlign: 'center' }}>fotobook ©2020 Built on Arweave</Footer>
			</Layout>
		</Router>
		);
	}
}

export default App;
//<Route component={Notfound} />
    //<div className="App">
//		<displayLayout/>
//      <Header />

//	  <Footer />
//    </div>
