import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../components/index.css';
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import { and, equals } from 'arql-ops';
import Arweave from "arweave/web";
import Gallery from 'react-grid-gallery';
import InfiniteScroll from 'react-infinite-scroller';

const { Header, Content, Footer } = Layout;

const arweave = Arweave.init({host: 'arweave.net', port: 443, protocol: 'https'})

const fetchQuery = async(key) => {
	//console.log(key);
	if (key === "")
	{
		const myQuery = and(
	//	equals('App-Name', 'image_upload'),
		equals('App-Name', 'fotobook'),
		equals('App-Version', 'Demo_v1'),
		equals('Content-Type', 'image/jpeg'),
		);
	
		const results = await arweave.arql(myQuery);
		//console.log('result:',results);
		//console.log('result1:',results[0]);
		//console.log('result size:', results.length);
		return results
	}
	else
	{
		const myQuery = and(
		//equals('from', 'UoU7el4ykxriScAf5iA5PUYAKPFaXL1XBmojfDzP8ZI'),
		//equals('from', '0tpyxSoKgP4zHh17g9bzMKrv5AAnWhZGrD1I88RJrHM'),
		equals('App-Name', 'fotobook'),
		equals('App-Version', 'Demo_v1'),
		equals('from',key),
		equals('Content-Type', 'image/jpeg'),
		);
		
		const results = await arweave.arql(myQuery);
		//console.log('result:',results);
		//console.log('result1:',results[0]);
		//console.log('result size:', results.length);
		return results;
	}
};

 
class SearchImage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			txs:"",
			image_num:0,
			allposts: [],
			posts: [],
			hasMore: true,
			curpage: 0,
			pagesize: 5,
			totalPage: 0,
			total: 0,
			hasMoreItems: true,
			imageTxID:'',
			data:'',
			image_num:'',
			IMAGES:[]
		};
	}
	
	async	componentDidMount(){
		//console.log("here:"+this.props.match.url);
		await this.loadData();
		//console.log("loadData:"+this.state.txs);
	
		const new_results = await fetchQuery(this.state.txs[1]);
		this.setState({imageTxID:new_results});
		this.setState( {image_num: new_results.length + " images"});
	
		const IMAGES = new_results.map(image_url_path=>({
				src:"https://arweave.net/"+image_url_path, thumbnail:"https://arweave.net/"+image_url_path, thumbnailWidth: 320,
				thumbnailHeight: 212
		}))
		this.setState({IMAGES})
		//console.log("componentDidMount images:"+this.state.IMAGES.length);
		//for(var i = 0; i< new_results.length; i++){
		let curpage = this.state.curpage;
		let posts = this.state.IMAGES.slice(
			curpage * this.state.pagesize,
			(curpage + 1) * this.state.pagesize
		);
		this.setState({
			allposts: IMAGES,
			posts: posts,
			total: new_results.length,
			totalPage: Math.ceil(new_results.length / this.state.pagesize)
		});
	
	}
	
	async loadData() {
    // TODO handle errors
		this.setState({txs:this.props.match.url.split("/search/")});
	}  
  
	loadItems() {
		//console.log("loadItems");
		if (this.state.curpage + 1 < this.state.totalPage) {
			let curpage =
			this.state.curpage < this.state.totalPage
			? this.state.curpage + 1
			: this.state.curpage;
			let posts = this.state.allposts.slice(
				0,
				(curpage + 1) * this.state.pagesize
			);
			this.setState({ posts: posts, curpage });
			} else {
			this.setState({ hasMore: false });
		}
		//console.log("scroll here:"+this.state.image_num);
	}
  
	handleClick(newIndex){
		//console.log("debug1:"+this.state.imageTxID[newIndex]);
		//alert(this.state.imageTxID);
		window.location.hash="#/photo/"+this.state.imageTxID[newIndex];
	}
	
	render(){
		const loader = <div className="loader">Loading ...</div>;
		return (
			<InfiniteScroll
                pageStart={0}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMore}
                loader={loader}	
			>
			<div>
				<p>Arweave Wallet: {this.state.txs}</p>
				<p>Search result: {this.state.image_num}</p>
		
				<Gallery images={this.state.posts} onClickThumbnail={this.handleClick.bind(this)} />,
				<Button type="primary" onClick={this.loadItems.bind(this)} style={{float: 'middle'}}>Load More...</Button>
			</div>
			</InfiniteScroll>
     
		);
	}
}
export default SearchImage;
