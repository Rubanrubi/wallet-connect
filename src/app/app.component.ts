import { Component } from '@angular/core';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { from, Observable } from 'rxjs';
import { Web3Service } from 'ng-blockchainx'
const abi =  require('../assets/erc20.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wallet-connect-test';
  private web3: any;
  private walletConnectProvider: any;
  private contract: any;
  public web3Set : any;

  constructor(
  public web3Service:Web3Service
){

}


  async ngOnInit() {
    // this.walletConnectProvider = new WalletConnectProvider({
    //   rpc: {
    //     [80001]: 'https://rpc-mumbai.matic.today/'
    //   },
    //   bridge: 'https://bridge.walletconnect.org'
    // });
    // console.log('wallet connect',this.walletConnectProvider);
    // this.web3 = new Web3(this.walletConnectProvider);
    // console.log('web3',this.web3);
    // this.walletConnectProvider.enable();
    // this.contract = new this.web3.eth.Contract(abi, '0xd8a5e61277dA186C5AEEE42cA3C3E82d7C435a68');
    // const txRecept = await this.web3.eth.getTransactionReceipt("0x6b76683c2276b42208c8b0183f156933ef3446b6bb26d50437407ffb18096843").then('jhjghfjhgjfh',console.log);
    // console.log("Transaction", txRecept);
const params  ={
  chainId:'80001',
  rpcUrl:'https://endpoints.omniatech.io/v1/matic/mumbai/public', 
}
const walletType = 2;
console.log("params, walletType",params, walletType);

    this.web3Service.connect(params, walletType).then((response) => {
      console.log("response",response);
      
    });
    this.web3Set = this.web3Service.web3;
     
     this.web3Service.getContract(require('../assets/erc20.json'),'0xd8a5e61277dA186C5AEEE42cA3C3E82d7C435a68').then((response) => {
      this.contract = response;
    });
    
    
  }

  // public sendTransaction = new Observable((observer) => {
  //   const message = {
  //     method: 'eth_sendTransaction',
  //     from: "0x7a7D6f253bE83b4FB07c7b02d2247672BD46eAb5",
  //     to: "0x84281bCeF8Bd174c4AF7747807BDf037B4a49880",
  //     data: "0x",
  //     value: 100000000
  //   }
  //   return this.web3.eth.sendTransaction(message);
  // });


  async send(){
    console.log("called here");
    console.log("this.contract",this.contract);
    const message = {
      tokenName: "name.value",
      tokenSymbol: "symbol.value",
      baseUri: "environment.BASE_URL",
    };
    const createCollectionAbi = await this.contract.methods.pause().encodeABI();
    const data = {
      method:'eth_sendTransaction',
      from:'0xB5937edC8346c3c4E726137CAB1016D39b8b0F47',
      to:'0xd8a5e61277dA186C5AEEE42cA3C3E82d7C435a68',
      data:createCollectionAbi

    }
    console.log("data",data);
    
    const sendResponse = await this.sendCheck(data);
    console.log("sendResponse",sendResponse);
    
    
    
  }
  public sendCheck(data:any){
    return new Promise( (resolve: any, reject: any)  => {
      this.web3Service.web3.eth.sendTransaction(data).then((response : any) => {
        console.log("response",response);
      }).
      catch((error : any) => {
        console.log("error",error);
        
      })  
    })
  }
  /**
   * Sends transaction
   */
  public async sendTransaction() {
    const data = {
      tokenName: "name.value",
      tokenSymbol: "symbol.value",
      baseUri: "environment.BASE_URL",
    };
    const createCollectionAbi = await this.contract.methods.createERC721Collection(data.tokenName, data.tokenSymbol, data.baseUri).encodeABI();
    const message = {
      method: 'eth_sendTransaction',
      from: '0xB5937edC8346c3c4E726137CAB1016D39b8b0F47',
      to: '0xd8a5e61277dA186C5AEEE42cA3C3E82d7C435a68',
      data: createCollectionAbi,
    };
    // debugger
    // await this.web3.eth.sendTransaction(message)
    //     .then((receipt: { logs: { address: any; }[]; }) => {
    //       console.log("receipt",receipt);
    //     })
    //     .catch((error: { code: number; }) => {
    //       console.log("error",error);
          
    //     });
    // const transferAbi = this.contract.methods.transfer("0x84281bCeF8Bd174c4AF7747807BDf037B4a49880", "1000000000000000000000").encodeABI();
    // const message = {
    //   method: 'eth_sendTransaction',
    //   from: "0x7a7D6f253bE83b4FB07c7b02d2247672BD46eAb5",
    //   to: "0xcBBC92E18B69fB3775D40E8183419FBf364138a6",
    //   data: transferAbi,
    // }
    console.log("message",message);
    debugger
    await this.web3.eth.sendTransaction(message)
    .on('transactionHash',async (hash: any) => { 
      console.log('transactionHash', hash);
    }).on('receipt', function(receipt: any){
      console.log('receipt', receipt);
    })
    .on('error', function(error: any){
      console.log('error', error);
    })
    .then(function(receipt: any){
      
        // will be fired once the receipt is mined
        console.log('reciept after', receipt);
    });
  }

  /**
   * Waits for receipt
   * @param txHash 
   * @returns  
   */
  public async waitForReceipt(txHash: any) {
    let receipt = null;
    while (receipt === null) {
      receipt = await this.web3.eth.getTransactionReceipt(txHash);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return receipt;
  }
  

  // public sendTx() {
  //   this.sendTransaction.subscribe(() => {
  //     this.transactionHash$.subscribe((hash) => {
  //       console.log(hash);
  //     });
  //     this.receipt$.subscribe((receipt) => {
  //       console.log(receipt);
  //     });
  //     this.error$.subscribe((error) => {
  //       console.log(error);
  //     });
  //   })
  // }


  // public transactionHash$ = from(new Promise((resolve) => {
  //   this.walletConnectProvider.once('transactionHash', (hash: any) => {
  //     resolve(hash);
  //   });
  // }));

  // public receipt$ = from(new Promise((resolve) => {
  //   this.walletConnectProvider.once('receipt', (receipt: any) => {
  //     resolve(receipt);
  //   });
  // }));

  // public error$ = from(new Promise((resolve) => {
  //   this.walletConnectProvider.once('error', (error: any) => {
  //     resolve(error);
  //   });
  // }));



}
