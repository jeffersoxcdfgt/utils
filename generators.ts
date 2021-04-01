import { Component , OnInit , AfterViewInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../ app.state';
import { ADD_HEADER  , ADD_COMBO_ELEMENT , RESET_CHOICE_ELEMENT } from 'src/app/redux/header/header.actions';
import {
   getUrlspotfireError ,
   getTokenError ,
   getProviderinfoError  ,
   getProviderinfotabError ,
   getUrlspotfire,
   getToken ,
   getProviderinfo ,
   getProviderinfotab} from './redux/provider-stream.reducers';
import {
  providerstreamGet ,
  providerstreamToken ,
  providerstreamInfo ,
  providerstreamInfoTab,
  setDashboard
} from './redux/provider-stream.actions';
import { GET_CHOICE_SELECTOR } from '../../redux/app.reducer';
import { GET_CHOICE_ELEMENT } from '../../redux/header/header.actions';
import {  showDashboards } from './class/objectsdashboards';
import {  
    activityreportmdcdrgdx,
    activityreportmdcdrgpx 
  } from './class/functions';


import { mergeMap } from 'rxjs/operators';

const FIRST = 0;
const NUMBER_CALLING = 4;
enum REPORT {
  ACTIVITY_REPORT = '1',
  INDUSTRY_INFLUENCE = '2',
  NETWORK_RELATIONSHIPS = '3',
  WORKLOAD = '4',
  EXPERIENCE_BY_QUARTER = '5',
  MDCDRGPX = 5,
  MDCDRGDX = 6
}

const listReport = [
  {tab_group_id: 'drg'  , identifier: 'activity_report_drg' , domain_code: 'px' , show: 'displayElementMdcdrgpx'},
  {tab_group_id: 'drg'  , identifier: 'activity_report_drg' , domain_code: 'dx' ,  show: 'displayElementMdcdrgdx'},
  {tab_group_id: 'i10'  , identifier: 'activity_report_I10' , domain_code: 'px' ,  show: 'displayElementicd10primarypx'},
  {tab_group_id: 'i10'  , identifier: 'activity_report_I10' , domain_code: 'dx' ,  show: 'displayElementicd10primarydx'},
  {tab_group_id: 'i10'  , identifier: 'activity_report_I10_Any_Mention' , domain_code: 'px' ,  show: 'displayElementicd10anypx'},
  {tab_group_id: 'i10'  , identifier: 'activity_report_I10_Any_Mention' , domain_code: 'dx' ,  show: 'displayElementicd10anydx'},
  {tab_group_id: 'hcpcs'  , identifier: 'activity_report_hcpcs' , domain_code: 'px' ,  show: 'displayElementhpcs'},
  {tab_group_id: 'apc'  , identifier: 'activity_report_apc' , domain_code: 'px' ,  show: 'displayElementapc'},
  {tab_group_id: 'hipps'  , identifier: 'activity_report_hipps_irf' , domain_code: 'px' ,  show: 'displayElementhippsInpa'},
  {tab_group_id: 'hipps'  , identifier: 'activity_report_hipps_hha' , domain_code: 'px' ,  show: 'displayElementhippsHome'},
  {tab_group_id: 'referrals_referrals_quarter'  , identifier: 'relationships_referrals_quarter_networks' , domain_code: 'hcptohcp' ,  show: 'displayElementRefferalsByqhcp'},
  {tab_group_id: 'referrals_referrals_quarter'  , identifier: 'relationships_referrals_quarter_networks' , domain_code: 'hcptogrp' ,  show: 'displayElementRefferalsByqgrp'},
  {tab_group_id: 'referrals_referrals_quarter'  , identifier: 'relationships_referrals_quarter_networks' , domain_code: 'hcptohco' ,  show: 'displayElementRefferalsByqhco'},
  {tab_group_id: 'referrals_referrals_year'  , identifier: 'relationships_referrals_year_networks' , domain_code: 'hcptohcp' ,  show: 'displayElementRefferalsByyearhcp'},
  {tab_group_id: 'referrals_referrals_year'  , identifier: 'relationships_referrals_year_networks' , domain_code: 'hcptogrp' ,  show: 'displayElementRefferalsByyeargrp'},
  {tab_group_id: 'referrals_referrals_year'  , identifier: 'relationships_referrals_year_networks' , domain_code: 'hcptohco' ,  show: 'displayElementRefferalsByyearhco'},
  {tab_group_id: 'referrals_received_quarter'  , identifier: 'relationships_received_quarter_networks' , domain_code: 'hcpfromhcp' ,  show: 'displayElementReceivedhcp'},
  {tab_group_id: 'referrals_received_year'  , identifier: 'relationships_received_year_networks' , domain_code: 'hcpfromhcp' ,  show: 'displayElementReceivedhcpyear'},

];

class ProviderInfoStremGet {
   Name: string = '';
   PCPorspecyype: string = '';
   Prefspecialtydescription: string = '';
   Providersegmenttype: string = '';
   Taxonomycode: string = '';
   Type: string = '';
   Npi: string = '';
   Organization: string = '';
   Category: string = '';
   Facility: string = '';
   PLorgcareclasssubtype = '';
   PLorgcareclasstype = '';
   Subtype = '';
}

@Component({
  selector: 'app-provider-stream',
  templateUrl: './provider-stream.component.html',
  styleUrls: ['./provider-stream.component.scss']
})

export  class ProviderStreamComponent implements OnInit , AfterViewInit {
  url: string = '';
  path: string = 'purplelab/dashboards';
  param: string = '';
  selectInfobox: string;
  tabSelect: string;

  showactivityReport = true;
  showindustryInfluence = false;
  networkRelationships = false;
  showWorkload = false;
  showExperiencequarter = false;
  dataArray = [];
  isDisableScreen;

  arrayShowdashboard = showDashboards();
  transdata: any;
 // Provider stream
  dataProvider: ProviderInfoStremGet = new ProviderInfoStremGet();
  // Provider stream

  pathdashboardspot = '';
  paramdashboardspot  = '';
  valueparam = '';
  selectecho = '';
  lstids = [];
  info: any;
  token: any;
  providerinfo: any;

  createId;
  generatorOptions;
  idFilters = () => {
    return function*(): any {
        yield  {value: '1', label: 'Activity Report' , searchvalue: ''  },
        yield  {value: '2', label: 'Industry Influence' , searchvalue: 'industry_influence' },
        yield  {value: '3', label: 'Network Relationships', searchvalue: 'referrals_referrals_year' , searchvalue2: 'referrals_received_year'},
        yield  {value: '4', label: 'Workload' , searchvalue: 'workload'},
        yield  {value: '5', label: 'Experience by quarter', searchvalue: 'experience_by_quarter'};
    };
   }



   createFunction; 
   executionfunction;
   myfunc = (valuerouter: Router , store: Store<AppState> ) => {
    return function*(): any {
        //console.log(valuerouter)
        console.log("VA PARA PX .........")
        valuerouter.navigateByUrl(activityreportmdcdrgpx, {skipLocationChange: true});
        yield 
        
    };
   }

   //createFunction2; 
   
   /*myfunc2 = (valuerouter: Router ,  store: Store<AppState> ) => {
    return function*(): any {
       // console.log(valuerouter)
        console.log("VA PARA DX" )
        valuerouter.navigateByUrl(activityreportmdcdrgdx, {skipLocationChange: true});
        yield 
        
    };
   }*/

   executionreportmdcdrgpx;
   executionreportmdcdrgdx
   myfuncreport = (valuerouter: Router ,  store: Store<AppState> ,typereport: string ) => {
    return function*(): any {
       // console.log(valuerouter)
        console.log("EJECUTO" )
        valuerouter.navigateByUrl(typereport, {skipLocationChange: true});
        yield 
        
    };
   }




   constructor(private store: Store<AppState>,
               private activatedRoute: ActivatedRoute,
               private storeHeader: Store,
               private router: Router){

      this.createId = () => this.idFilters()();
      this.generatorOptions = this.createId();

      /*this.createFunction = this.myfunc(this.router,store)();
      this.executionfunction = this.createFunction */

      /*this.createFunction2 = this.myfunc2(this.router,store)();
      this.executionfunction2 = this.createFunction2 */

      /*this.createFunction2 = this.myfuncreport(this.router,store , activityreportmdcdrgdx)();
      this.executionfunction2 = this.createFunction2 */

      this.executionreportmdcdrgpx = this.myfuncreport(this.router,store , activityreportmdcdrgpx)();
      this.executionreportmdcdrgdx = this.myfuncreport(this.router,store , activityreportmdcdrgdx)();
      
      //this.executionfunction2 = this.createFunction2 


  }

  callmdcdrgpx = () => {
    //this.executionfunction.next().value
    this.executionreportmdcdrgpx.next().value
   
      
  }

  callmdcdrgdx = () => {
    this.executionreportmdcdrgdx.next().value
  }

  ngOnInit(): void{
    this.store.dispatch(ADD_HEADER({
      isBtnBack : true,
      title: `Provider Stream`
    }));
    this.store.select(getUrlspotfireError).subscribe((error) => this.loadingError(error));
    this.store.dispatch(providerstreamGet());

    this.store.select(getTokenError).subscribe((error) => this.loadingError(error));
    this.store.dispatch(providerstreamToken());
    const report  = 'provider_streams';
    this.chooseOption();


    this.activatedRoute.queryParams.subscribe(params => {
      if ((params['type'] !== undefined &&  params['type'] !== '') &&
          (params['value'] !== undefined &&  params['value'] !== '')){

            const codevalue = params['value'];
            const typecode =  params['type'];
            const tab =  params['tab'];

            this.store.select(getProviderinfoError).subscribe((error) => this.loadingError(error));
            this.store.dispatch(providerstreamInfo({codevalue, typecode}));

            this.store.select(getProviderinfotabError).subscribe((error) => this.loadingError(error));
            this.store.dispatch(providerstreamInfoTab({typecode , codevalue, report }));
            this.store.select(getUrlspotfire)
            .pipe(
              mergeMap(() => this.store.select(getToken)
                  .pipe(mergeMap(() =>
                      this.store.select(getProviderinfo).pipe(mergeMap(() =>
                        this.store.select(getProviderinfotab)))
                  )))
                  )
                  .subscribe((data) => {
                      if (data.length  === NUMBER_CALLING){
                          this.tabSelect = tab;
                          this.selectInfobox = params['type'];
                          this.valueparam = params['value'];
                          this.dataArray =  Object.keys(data).map((k) => data[k]);
                          this.loadReport();
                      }
               });
          }
      });
  }


   loadReport(): void {
      const server = this.dataArray.filter((val) => val.hasOwnProperty('server') === true);
      this.token = this.dataArray.filter((val) => val.hasOwnProperty('token') === true);
      this.providerinfo = this.dataArray.filter((val) => val.hasOwnProperty('info') === true);
      this.url  = `https://${server[FIRST].server}`;

      this.info = this.dataArray.filter((val) => {
        return (val.hasOwnProperty('activity_report') === true && this.lstids.push(this.generatorOptions.next().value)) ||
               (val.hasOwnProperty('industry_influence') === true && this.lstids.push(this.generatorOptions.next().value)) ||
               (val.hasOwnProperty('relationships_referrals') === true && this.lstids.push(this.generatorOptions.next().value)) ||
               (val.hasOwnProperty('workload') === true && this.lstids.push(this.generatorOptions.next().value)) ||
               (val.hasOwnProperty('experience_by_quarter') === true && this.lstids.push(this.generatorOptions.next().value))
       })   
       

      this.dataProvider.Name = this.providerinfo[FIRST].info.Name;
      this.dataProvider.PCPorspecyype = this.providerinfo[FIRST].info['PCP or Spec Type'];
      this.dataProvider.Prefspecialtydescription = this.providerinfo[FIRST].info['Pref Specialty Description'];
      this.dataProvider.Providersegmenttype = this.providerinfo[FIRST].info['Provider Segment Type'];
      this.dataProvider.Type = this.providerinfo[FIRST].info['Type'];
      this.dataProvider.Taxonomycode = this.providerinfo[FIRST].info['Taxonomy Code'];
      this.dataProvider.Npi = this.valueparam;
      this.dataProvider.Organization = this.providerinfo[FIRST].info['Organization'];
      this.dataProvider.Category = this.providerinfo[FIRST].info['Category'];
      this.dataProvider.Facility = this.providerinfo[FIRST].info['Facility'];
      this.dataProvider.Subtype = this.providerinfo[FIRST].info['SubType'];
      this.dataProvider.PLorgcareclasstype = this.providerinfo[FIRST].info['PL Orgcare Class type'];
      this.dataProvider.PLorgcareclasssubtype = this.providerinfo[FIRST].info['PL Orgcare Class Subtype'];

      const options = this.lstids.filter((value) => value !== undefined );
      const selectedoption = options.find((valueopt) =>  {
        if (valueopt.hasOwnProperty('searchvalue2') && valueopt.searchvalue2 === this.tabSelect ){
            return valueopt;
        }
        return this.tabSelect === valueopt.searchvalue.toLowerCase();
      });


      this.selectecho = selectedoption !== undefined && this.tabSelect ? selectedoption.value : '';
      if (this.tabSelect === undefined ){
        this.selectecho = REPORT.ACTIVITY_REPORT;
       }

      this.store.dispatch(ADD_COMBO_ELEMENT({
            options,
            isVisibleOpt: true,
            selectOpt: this.selectecho
        }));
      this.store.dispatch(GET_CHOICE_ELEMENT({choice: this.selectecho}));
      this.store.dispatch(setDashboard({
        params:{ 
            idvalue:this.valueparam,
            typecode: this.selectInfobox,
            providerinfo:this.providerinfo,
            token:this.token,
            url:this.url
        }
      }))
 }



  clickOntabHorizontalParent(tabIndex: number): void {
    
  }

  clickOntabHorizontalChildren(tabIndex: number): void {
      switch (tabIndex) {
        case REPORT.MDCDRGPX:
        this.router.navigateByUrl(activityreportmdcdrgpx, {skipLocationChange: true});
          break;
        case REPORT.MDCDRGDX:
          this.router.navigateByUrl(activityreportmdcdrgdx, {skipLocationChange: true});
          break;      
        default:
          break;
      }
  }

  clickOntabVertical(tabIndex: number , param: string = ''): void {
    
  }

  changePanel = ( typeshow: string) => {
    this.arrayShowdashboard = showDashboards();
    const valueconst = this.changeValueObjectAttribute(this.arrayShowdashboard , typeshow , 'true');
    this.transdata = valueconst;
    this.arrayShowdashboard = this.transdata;
  }

  chooseOption = () => {
    this.storeHeader.select(GET_CHOICE_SELECTOR).subscribe(res => {
      if (res.choice !== ''){
          switch (res.choice) {
            case REPORT.ACTIVITY_REPORT:
              this.changePanel('showactivityReport');
              break;
            case REPORT.INDUSTRY_INFLUENCE:
              this.changePanel('showindustryInfluence');
              break;
            case REPORT.NETWORK_RELATIONSHIPS:
              this.changePanel('networkRelationships');
              break;
            case REPORT.WORKLOAD:
              this.changePanel('showWorkload');
              break;
            case REPORT.EXPERIENCE_BY_QUARTER:
              this.changePanel('showExperiencequarter');
              break;
            default:
              break;
          }
          this.store.dispatch(RESET_CHOICE_ELEMENT());
     }
  });
  }


  changeValueObjectAttribute = (arryData: object , pattern: string , value: string ) => {
    const res = this.getKeys(arryData , new RegExp(pattern));
    const result = Object.keys(arryData).map((key) =>  JSON.parse(`{ "${key}":"${arryData[key]}"}`) );
    const castValue = Object.keys(res).map((key) =>  JSON.parse(`{ "${key}":"${value}"}`)).shift();
    const data = [
      ...result,
      castValue
    ];
    const myobject = {};

    for (const valuedata of data) {
       Object.keys(valuedata).map((key) => myobject[`${key}`] =  (valuedata[key] === 'true'));
    }
    return myobject;
  }

  getKeys  = (myvalue , pattern ) => {
    const filteredkeys = (obj, filter) => {
       const keys = [];
       for (const key of Object.keys(obj)){
        if (obj.hasOwnProperty(key) && filter.test(key)) {
          keys.push(key);
        }
      }

       const filtered = Object.keys(myvalue)
      .filter(key => keys.includes(key))
      .reduce((objdata, key) => {
        return {
          ...objdata,
          [key]: myvalue[key]
        };
      }, {});

       return filtered;
    };
    return filteredkeys(myvalue, pattern);
  }


    /*
    * Error get url
    * @param error
    * @returns message error
    */
   loadingError(error): void {
    if (error) {
      alert('Error while api get');
    }
  }

  OutputEvent($event: boolean): void {
    this.isDisableScreen = $event;
  }

  ngAfterViewInit(): void{
  }
}
