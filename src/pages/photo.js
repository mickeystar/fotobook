import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../components/index.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Radio, Button, Modal, Upload } from 'antd';
import { Comment, Avatar, Form, List, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import  {HomeOutlined,HeartTwoTone,FlagOutlined}  from '@ant-design/icons';
import Icon from '@ant-design/icons';
import moment from 'moment';
import Arweave from "arweave/web";
import { and, equals } from 'arql-ops';
import { readContract } from 'smartweave'
import { selectWeightedPstHolder } from 'smartweave'

const { Header, Content, Footer } = Layout;
const arweave = Arweave.init({host: 'arweave.net', port: 443, protocol: 'https'})

const { TextArea } = Input;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, commentvalue }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} commentvalue={commentvalue} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </>
);

//findLoveCount
const findLoveCount = async(key) => {
	//console.log("key:"+key);
	
		const myQuery = and(
		//equals('from', 'UoU7el4ykxriScAf5iA5PUYAKPFaXL1XBmojfDzP8ZI'),
		//equals('from', '0tpyxSoKgP4zHh17g9bzMKrv5AAnWhZGrD1I88RJrHM'),
		//equals('App-Name','fotobook'),
		equals('App-Name', 'fotobook'),
		equals('App-Version', 'Demo_v1'),
		equals('Image-Txid',key),
		
		);
		
		const results = await arweave.arql(myQuery);
		//console.log('result:',results);
		return results;
		
	
};

//icon
const HeartSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
  </svg>
);
const HeartIcon = props => <Icon component={HeartSvg} {...props} />;

const ArweaveSvg = () => (
<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
<circle cx="16.3761" cy="15.9919" r="14.6637" stroke="#222326" stroke-width="2.5"/>
<path d="M19.1136 21.2908C19.0424 21.1484 18.9819 20.9846 18.9321 20.7995C18.8822 20.6143 18.8395 20.4185 18.8039 20.212C18.6401 20.39 18.4514 20.5574 18.2378 20.714C18.0241 20.8707 17.7856 21.0096 17.5221 21.1306C17.2658 21.2445 16.9809 21.3336 16.6676 21.3976C16.3543 21.4688 16.0161 21.5045 15.6529 21.5045C15.0619 21.5045 14.5171 21.419 14.0187 21.2481C13.5273 21.0772 13.1036 20.8387 12.7476 20.5325C12.3915 20.2263 12.1138 19.8631 11.9144 19.443C11.715 19.0157 11.6154 18.5529 11.6154 18.0544C11.6154 16.8367 12.0675 15.8968 12.9719 15.2345C13.8834 14.5652 15.2399 14.2305 17.0415 14.2305H18.6971V13.5469C18.6971 12.9914 18.5155 12.5535 18.1523 12.2331C17.7892 11.9055 17.2658 11.7417 16.5822 11.7417C15.9769 11.7417 15.5354 11.8735 15.2577 12.1369C14.98 12.3933 14.8411 12.7387 14.8411 13.173H11.8717C11.8717 12.6817 11.9785 12.2153 12.1921 11.7738C12.4129 11.3323 12.7298 10.9442 13.1428 10.6095C13.5629 10.2748 14.0721 10.0114 14.6702 9.8191C15.2755 9.61971 15.9662 9.52002 16.7424 9.52002C17.4402 9.52002 18.0882 9.60547 18.6864 9.77637C19.2917 9.94727 19.815 10.2001 20.2565 10.5347C20.698 10.8694 21.0434 11.2931 21.2926 11.8058C21.5419 12.3114 21.6665 12.8989 21.6665 13.5682V18.5244C21.6665 19.1439 21.7056 19.6566 21.784 20.0625C21.8623 20.4684 21.9762 20.8173 22.1258 21.1092V21.2908H19.1136ZM16.2831 19.208C16.5822 19.208 16.8599 19.1724 17.1162 19.1012C17.3726 19.0299 17.604 18.9374 17.8105 18.8234C18.017 18.7095 18.195 18.5813 18.3446 18.4389C18.4941 18.2894 18.6116 18.1398 18.6971 17.9903V16.0036H17.1803C16.7175 16.0036 16.3223 16.0499 15.9947 16.1424C15.6671 16.2279 15.4001 16.3525 15.1936 16.5163C14.9871 16.6729 14.834 16.8652 14.7343 17.0931C14.6346 17.3138 14.5848 17.5559 14.5848 17.8194C14.5848 18.2182 14.7236 18.5493 15.0013 18.8128C15.2862 19.0762 15.7134 19.208 16.2831 19.208Z" fill="#222326"/>
</svg>
);
const ArweaveIcon = props => <Icon component={ArweaveSvg} {...props} />;


class Photo extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			post: null,
			user: null,
			commentsData: null,
			txId:'',
			imageUrl:'',
			ownerAddress:'',
			ownerAddressUrl:'',
			imageDesc:'',
			imageCat:'',
			//modal
			loading: false,
			visible: false,
			//radio
			value: 1,
			ARvalue: 0,
			ARtip:0,
			//upload wallet
			fileList1: [
			],
			wallet:'',
			address:'',
			balance:'',
			//comment
			comments: [],
			submitting: false,
			commentvalue: '',
			//love
			loveCount:0,
			loveFlag:true
		};

	//    this.reloadComments = this.reloadComments.bind(this);
	}

	async componentDidMount() {
		//console.log("here:"+this.props.match.url);
		await this.loadData();
		//console.log("console:"+this.state.txId[1]);
	//	console.log("fetch:"+this.fetchUrl(this.state.txId[1]));
		const _imageUrl = "https://arweave.net/"+this.state.txId[1];
		this.setState({imageUrl:_imageUrl});
	
		const transaction = arweave.transactions.get(this.state.txId[1]).then(transaction => {
			const ownerstring = transaction.get('owner');
		//	console.log("ownerstring:"+ownerstring);
		
			transaction.get('tags').forEach(tag => {
				let key = tag.get('name', {decode: true, string: true});
				let value = tag.get('value', {decode: true, string: true});
				if(key=='Image-Desc'){
					//console.log(`${key} : ${value}`);
					this.setState({imageDesc:value});
				}
				if(key=='Category'){
					//console.log(`${key} : ${value}`);
					this.setState({imageCat:value});
				}
			});
		
			(async ()=> {
				const owneraddress = await arweave.wallets.ownerToAddress(ownerstring);
				//console.log("owneraddress:"+owneraddress);
				this.setState({ownerAddress:owneraddress});
				this.setState({ownerAddressUrl:"./#/user/"+owneraddress});
			})()
			//.then(tx => arweave.wallets.ownerToAddress(tx.owner)
		
		});
		//const owneraddress = arweave.wallets.ownerToAddress(ownerstring);
		const new_results = await findLoveCount(this.state.txId[1]);
		//console.log("debug1");
		if(new_results.length>0)
		{
			for(var i = 0; i < new_results.length; i++) {
				const response = await arweave.transactions.getStatus(new_results[i]);

				//console.log("response:"+response.status);
		
				if((response.status == '200')&&(this.state.loveFlag)){
					//console.log('result1:',new_results[i]);
					//console.log('result size:', results.length);
					//console.log("i:"+i);
					const tx = arweave.transactions.get(new_results[i]).then(tx => {
						//const quantity = tx.get('quantity');
						//console.log("quantity:"+quantity/1000000000000);
						//this.setState({ARtip:quantity/1000000000000});
		
						tx.get('tags').forEach(tag => {
							let key = tag.get('name', {decode: true, string: true});
							let value = tag.get('value', {decode: true, string: true});
							if(key=='Love'){
								//console.log(`${key} : ${value}`);
								this.setState({loveCount:value});
								this.setState({loveFlag:false});
							}
							if(key=='Tip'){
								//console.log(`${key} : ${value}`);
								this.setState({ARtip:value});
							}
						});
					});
				}
			}
		}else{
			//console.log("no result, lovecount 0");
			this.setState({loveCount:'0'});
		}
	}

	async loadData() {
		// TODO handle errors
		this.setState({txId:this.props.match.url.split("/photo/")});
	
		//  const { txId } = this.props;
		//   const { user, post } = await loadPost(txId);
		//    const commentsData = await loadComments(txId);

		//   this.setState({ isLoaded: true, post, user, commentsData });
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
		
		
		//love transaction submission
		//love txid
		
		//appname
		//version
		//image txid
		//owner address
		//love count  = prev+1
		//AR tips
		
		( async () => {
		
			//const temp64str = this.state.previewImage.split("base64,");
			//this.setState({base64str:temp64str[1]});
			//console.log("base64string:"+this.state.base64str);
	//		const data = this.state.base64str;
			//const tempstr = "abcde";
			//console.log("owneraddress:"+this.state.ownerAddress);
			//console.log("radiovalue:"+this.state.ARvalue);
		
			const tx = await arweave.createTransaction({
				target: this.state.ownerAddress,
				quantity: arweave.ar.arToWinston(this.state.ARvalue)}, this.state.wallet);
			//data: Buffer.from(this.state.base64str, 'base64')
			//console.log("transaction1:",tx);	
	//		transaction.addTag('App-Name', 'fotobook');
	//		transaction.addTag('App-Version', '1.1e29');
	//		tx.addTag('App-Name', 'love_counter');
			//tx.addTag('Content-Type', 'image/jpeg');
			tx.addTag('App-Name', 'fotobook');
			tx.addTag('App-Version', 'Demo_v1');
			tx.addTag('Image-Txid', this.state.txId[1]);
			tx.addTag('Owner-Addr', this.state.ownerAddress);
			//console.log("parse:"+Number(this.state.loveCount));
			//console.log("parse:"+(Number(this.state.loveCount)+Number(1)));
			//console.log(Number(this.state.ARtip));
			//console.log(Number(this.state.ARvalue));
			//console.log("total ar:"+(Number(this.state.ARtip)+Number(this.state.ARvalue)));
			//console.log((parseFloat(this.state.ARtip)+parseFloat(this.state.ARvalue)));
			tx.addTag('Love', (Number(this.state.loveCount)+Number(1)));
			tx.addTag('Tip', (Number(this.state.ARtip)+Number(this.state.ARvalue)));
	//		transaction.addTag('Image-Type', 'General');

	//		console.log("transaction2:"+tx);
			//wait 1st		
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
  
	//radio
	onChangeRadio = e => {
		//console.log('radio checked', e.target.value);
		let tempvalue= 0;
		if(e.target.value==1)
		{
			this.setState({ARvalue:"0"});
		}else if(e.target.value ==2)
		{
			this.setState({ARvalue:"0.25"});
			
		}
		else if(e.target.value==3)
		{
			this.setState({ARvalue:"0.5"});
		}else{
			this.setState({ARvalue:"1"});
		}
		this.setState({
			//value:tempvalue,
			value:e.target.value,
		});
	};
  
	//comment
	handleSubmit = () => {
		if (!this.state.commentvalue) {
			return;
		}

		this.setState({
		submitting: true,
		});

		setTimeout(() => {
			this.setState({
				submitting: false,
				commentvalue: '',
				comments: [
					{
						author: 'dummy user',
						avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
						content: <p>{this.state.commentvalue}</p>,
						datetime: moment().fromNow(),
					},
					...this.state.comments,
				],
			});
		}, 1000);
	
		//console.log("comment here");
	};

	handleChangeComment = e => {
		this.setState({
			commentvalue: e.target.value,
		});
	};
  
  
	//icon
	onIconClick() {
		alert("Report Inappropriate Content!, governanced by PST holders in future release");
	}

	//icon
		buttonClick() {
		alert("Followed! feature will be available in future release");
	}

	//upload wallet
	handleChange = info => {
		let fileList1 = [...info.fileList];

		// 1. Limit the number of uploaded files
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
	
	
  
	render(){
		//modal
		const { visible, loading } = this.state;
		//upload wallet
		const props = {
			action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
			onChange: this.handleChange,
			multiple: false,
		};
		//comment
		const { comments, submitting, commentvalue } = this.state;
		//const { txId } = this.props;
/*		
	const { txId } = this.props;
    const { post, user, commentsData, isLoaded } = this.state;
*/
		return (
  
			<div>
	
				<img src={this.state.imageUrl} width="100%" />
				<h2></h2>
        
				<FlagOutlined style={{ color: 'red',float: 'right',fontSize: '35px' }} onClick={this.onIconClick}/>
		
				<p>Posted by: <a href={this.state.ownerAddressUrl}>{this.state.ownerAddress}</a></p>
				<Button type="primary" onClick={this.buttonClick} style={{float: 'middle'}}>Follow</Button>
				<p>Image Description: {this.state.imageDesc}</p>
				<p>Category: {this.state.imageCat}</p>
		
		
					<Modal
						visible={visible}
						title="Give Love and Appreciation Tip"
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
			
					<p>Tipping
					<Radio.Group onChange={this.onChangeRadio} value={this.state.value}>
						<Radio value={1}>0 AR token</Radio>
						<Radio value={2}>0.25 AR token</Radio>
						<Radio value={3}>0.5 AR token</Radio>
						<Radio value={4}>1 AR token</Radio>
					</Radio.Group>
					</p>
				
					</Modal>
		
		
				<hr
					style={{
					color: "#000000",
					backgroundColor: "#000000",
					height: 2
					}}
				/>
		
		
				<p><HeartIcon style={{ color: 'hotpink', fontSize: '35px' }} onClick={this.showModal}/> {this.state.loveCount} people love this</p>
		
				<hr
					style={{
					color: "#000000",
					backgroundColor: "#000000",
					height: 2
					}}
				/>
		
				<p><ArweaveIcon  onClick={this.showModal}/> {this.state.ARtip} AR</p>
		
				<hr
					style={{
					color: "#000000",
					backgroundColor: "#000000",
					height: 2
					}}
				/>
		
				{comments.length > 0 && <CommentList comments={comments} />}
				<Comment
					avatar={
						<Avatar
							src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
							alt="dummy user"
						/>
					}
					content={
						<Editor
							onChange={this.handleChangeComment}
							onSubmit={this.handleSubmit}
							submitting={submitting}
							commentvalue={commentvalue}
						/>
					}
				/>

			</div>
		);
	}
}
 
export default Photo;
//<Icon type="edit" theme="twoTone" onClick={this.onIconClick} />
//<fotobookIcon style={{ color: 'hotpink' }} />

//<h1>photo here : </h1>
//<p>1st component for photo , fotobook{this.props.match.url}</p>
//<Button type="primary" onClick={this.showModal} style={{float: 'right'}}>Love</Button>
//<HomeOutlined  onClick={this.onIconClick}/>
//<p>love count: {this.state.loveCount}</p>
//		<p>AR tips: {this.state.ARtip}</p>
//<p>here icon <HeartTwoTone twoToneColor="#eb2f96" onClick={this.onIconClick} /> </p>

//<p>button to submit love/AR tips</p>

//todo
//unique player can vote/only 1 address 1 time
