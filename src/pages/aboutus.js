import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../components/index.css';
import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;
 
class About extends Component {
	render(){
		return (
      <div>
	  <p>fotobook is a photo sharing and permanent storage in all-in-one platform governanced by community members.</p>
	  <p>fotobook is built on top of <a href="https://www.arweave.org/">Arweave</a>  </p>
	  <p>You may get a AR wallet with some AR tokens here: <a href="https://www.arweave.org/wallet">AR Wallet</a> </p>
	  <p>Version: Demo</p>
	  <p>Features available:</p>
	  <p>1) Quick upload (currently only support up to 7MB JPEG image filesize)</p>
	  <p>2) Love votes</p>
	  <p>3) AR tipping</p>
	  <p>All above transaction will be charged additional 0.05 AR to the PST (Profit Sharing Token) pool (subject to change in the future release)</p>
	  <p>Mock-up Features:</p>
	  <p>1) Comment</p>
	  <p>2) Red flag</p>
	  <p>3) Follow</p>
	  
	  <p>More exciting features are coming next, stay tuned!</p>
	  <p>Currently fotobook is desktop-friendly, not yet on mobile</p>
	  <p>Disclaimer: </p>
	  <p>This is a demo version which may have bugs. Therefore fotobook is not be liable for any losses and damages in connection
         with the use of our website. </p>
	  <p>Acceptable Use; Disclaimer</p>
	  <p>fotobook don't have the control over the content being uploaded by users.	  </p>
	  <p>You as a user is solely responsible for the image content that you uploaded and you agree not to post the following content through fotobook any of the following:</p>
	  <p>1) Content that is unlawful, defamatory, hateful, harassing, threatening, invasive of privacy or publicity rights, abusive, inflammatory, fraudulent or otherwise objectionable or harmful;</p>
	  <p>2) Content that is obscene, pornographic, indecent, lewd, sexually suggestive, including without limitation photos, screeshot videos or other User Content containing nudity;</p>
	  <p>3) Content that would constitute, encourage or provide instructions for a criminal offense, violate the rights of any party, endanger national security, or that would otherwise create liability or violate any local, state, national or international law;</p>
	  <p>4) Content that may infringe or violate any patent, trademark, trade secret, copyright or other intellectual or other proprietary right of any party; User Content that impersonates any person or entity or otherwise misrepresents your affiliation with a person or entity;</p>

	  <p>YOUR USE OF THE SERVICES IS SOLELY AT YOUR OWN RISK</p>

        
      </div>
    );
}
}
export default About;
//        <h2>GOT QUESTIONS?</h2>
 //       <p>The easiest thing to do is post on
//        our <a href="http://fotobook.io">fotobook</a>.</p>