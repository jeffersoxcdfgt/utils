import { Component , OnInit , AfterViewInit , ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../ app.state';
import { ADD_HEADER  , ADD_COMBO_ELEMENT , RESET_CHOICE_ELEMENT } from 'src/app/redux/header/header.actions';
import { ProviderStreamListComponent } from './provider-stream-list/provider-stream-list.component';
import { VerticalMiniTabsComponent } from '../../shared/components/vertical-mini-tabs/vertical-mini-tabs.component';
import {
   getUrlspotfireError ,
   getTokenError ,
   getProviderinfoError  ,
   getProviderinfotabError ,
   getUrlspotfire,
   getToken ,
   getProviderinfo ,
   getProviderinfotab,
  getDashboarvalue} from './redux/provider-stream.reducers';
import {
  providerstreamGet ,
  providerstreamToken ,
  providerstreamInfo ,
  providerstreamInfoTab
} from './redux/provider-stream.actions';
import {  mergeMap  } from 'rxjs/operators';
import { GET_CHOICE_SELECTOR } from '../../redux/app.reducer';
import { GET_CHOICE_ELEMENT } from '../../redux/header/header.actions';
import {  getDashboards , showDashboards } from './class/objectsdashboards';

const patients = 'patients';
const claims = 'claims';

const TABVERTICALCURRENT = 1;
enum REPORT {
  ACTIVITY_REPORT = '1',
  INDUSTRY_INFLUENCE = '2',
  NETWORK_RELATIONSHIPS = '3',
  WORKLOAD = '4',
  EXPERIENCE_BY_QUARTER = '5',
  drg = 0,
  i10 = 1,
  hcpcs = 2,
  apc = 3,
  hipps = 4,
  drgpx = 5,
  drgdx = 6,
  i10pripx= 7,
  i10pridx= 8,
  i10anypx= 9,
  i10anydx= 10,
  hippsinp= 13,
  hippshome= 14,
  PATIENTS = 0,
  CLAIMS = 1,
  DETAIL = 0,
  STANDARD = 1 ,
  referrals_quarter_grp = 21,
  relationships_referrals_year_networks = 17

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

const FIRST = 0;
const NUMBER_CALLING = 4;

@Component({
  selector: 'app-provider-stream',
  templateUrl: './provider-stream.component.html',
  styleUrls: ['./provider-stream.component.scss']
})

export  class ProviderStreamComponent implements OnInit , AfterViewInit {

  // Components veritcal
  @ViewChild('mdcdrgpxVertical') mdcdrgpxVertical: ProviderStreamListComponent;
  @ViewChild('mdcdrgdxVertical') mdcdrgdxVertical: ProviderStreamListComponent;
  @ViewChild('icd10primarypxVertical') icd10primarypxVertical: ProviderStreamListComponent;
  @ViewChild('icd10primarydxVertical') icd10primarydxVertical: ProviderStreamListComponent;
  @ViewChild('icd10anypxVertical') icd10anypxVertical: ProviderStreamListComponent;
  @ViewChild('icd10anydxVertical') icd10anydxVertical: ProviderStreamListComponent;
  @ViewChild('hpcspx') hpcspx: ProviderStreamListComponent;
  @ViewChild('apcpxdash') apcpxdash: ProviderStreamListComponent;
  @ViewChild('hippsdash') hippsdash: ProviderStreamListComponent;
  @ViewChild('hippsdashhome') hippsdashhome: ProviderStreamListComponent;
  @ViewChild('industryinfluencehcp') industryinfluencehcp: ProviderStreamListComponent;
  @ViewChild('referralsbyqhcp') referralsbyqhcp: ProviderStreamListComponent;
  @ViewChild('experiencebyquarterhcp') experiencebyquarterhcp: ProviderStreamListComponent;
  @ViewChild('experiencebyquarterhco') experiencebyquarterhco: ProviderStreamListComponent;
  @ViewChild('experiencebyquartergrp') experiencebyquartergrp: ProviderStreamListComponent;
  @ViewChild('verticalminicomponentsmdcpx') verticalminicomponentsmdcpx: VerticalMiniTabsComponent;
  @ViewChild('verticalminicomponentsmdcdx') verticalminicomponentsmdcdx: VerticalMiniTabsComponent;
  @ViewChild('verticalminiicd10primaypripx') verticalminiicd10primaypripx: VerticalMiniTabsComponent;
  @ViewChild('verticalminiicd10primaypridx') verticalminiicd10primaypridx: VerticalMiniTabsComponent;
  @ViewChild('verticalminiicd10anymentionpx') verticalminiicd10anymentionpx: VerticalMiniTabsComponent;
  @ViewChild('verticalminiicd10anymentiondx') verticalminiicd10anymentiondx: VerticalMiniTabsComponent;
  @ViewChild('verticalminicpthpcs') verticalminicpthpcs: VerticalMiniTabsComponent;
  @ViewChild('verticalminicapc') verticalminicapc: VerticalMiniTabsComponent;
  @ViewChild('verticalminihippsinpa') verticalminihippsinpa: VerticalMiniTabsComponent;
  @ViewChild('verticalminihippshome') verticalminihippshome: VerticalMiniTabsComponent;
  @ViewChild('verticalminireferralbyqhcp') verticalminireferralbyqhcp: VerticalMiniTabsComponent;
  @ViewChild('verticalminireferralbyqgrp') verticalminireferralbyqgrp: VerticalMiniTabsComponent;
  @ViewChild('verticalminireferralbyqhco') verticalminireferralbyqhco: VerticalMiniTabsComponent;
  @ViewChild('verticalminireferralbyyearhcp') verticalminireferralbyyearhcp: VerticalMiniTabsComponent;
  @ViewChild('verticalminireferralbyyeargrp') verticalminireferralbyyeargrp: VerticalMiniTabsComponent;
  @ViewChild('verticalminireferralbyyearhco') verticalminireferralbyyearhco: VerticalMiniTabsComponent;
  @ViewChild('verticalminireceivedquarter') verticalminireceivedquarter: VerticalMiniTabsComponent;
  @ViewChild('verticalminireceivedyear') verticalminireceivedyear: VerticalMiniTabsComponent;

  arrayfuncvertical = [
      {  id: 0 ,  func:  (() => {
        this.verticalminicomponentsmdcpx.changeCurrentTab(TABVERTICALCURRENT);
        this.verticalminicomponentsmdcdx.changeCurrentTab(TABVERTICALCURRENT);
      }
      )
     },
      {  id: 5 ,  func: (() => this.verticalminicomponentsmdcpx.changeCurrentTab(TABVERTICALCURRENT)) },
      {  id: 6 ,  func: (() => this.verticalminicomponentsmdcdx.changeCurrentTab(TABVERTICALCURRENT)) },

      {  id: 1 ,  func:  (() =>  {
        this.verticalminiicd10primaypripx.changeCurrentTab(TABVERTICALCURRENT);
        this.verticalminiicd10primaypridx.changeCurrentTab(TABVERTICALCURRENT);
        this.verticalminiicd10anymentionpx.changeCurrentTab(TABVERTICALCURRENT);
        this.verticalminiicd10anymentiondx.changeCurrentTab(TABVERTICALCURRENT);      }
      )
      },

      {  id: 7 ,  func:  (() =>  this.verticalminiicd10primaypripx.changeCurrentTab(TABVERTICALCURRENT))  },
      {  id: 8 ,  func:  (() =>  this.verticalminiicd10primaypridx.changeCurrentTab(TABVERTICALCURRENT))  },
      {  id: 9 ,  func:  (() =>  this.verticalminiicd10anymentionpx.changeCurrentTab(TABVERTICALCURRENT)) },
      {  id: 10 , func:  (() =>  this.verticalminiicd10anymentiondx.changeCurrentTab(TABVERTICALCURRENT)) },
      {  id: 2 , func:  (() =>  this.verticalminicpthpcs.changeCurrentTab(TABVERTICALCURRENT))},
      {  id: 3 , func:  (() =>  this.verticalminicapc.changeCurrentTab(TABVERTICALCURRENT))} ,
      {  id: 4 , func:  (() =>  {
          this.verticalminihippsinpa.changeCurrentTab(TABVERTICALCURRENT);
          this.verticalminihippshome.changeCurrentTab(TABVERTICALCURRENT);
      }
      )},
      {  id: 13 , func:  (() =>  this.verticalminihippsinpa.changeCurrentTab(TABVERTICALCURRENT))},
      {  id: 14 , func:  (() =>  this.verticalminihippshome.changeCurrentTab(TABVERTICALCURRENT))},
      {  id: 20 , func:  (() =>  console.log()  )},
      {  id: 21 , func:  (() =>  {
            this.HideColumns = true;
            this.mypagegrprefferal = 'GRP';
            this.reportNetwork();
            this.arrayData['displayElementRefferalsByqgrp'] = true;
      }
      )},
      {  id: 22 , func:  (() =>  {
        this.HideColumns = true;
        this.mypagegrprefferal = 'HCO';
        this.reportNetwork();
        this.arrayData['displayElementRefferalsByqhco'] = true;
      }
     )},
     {  id: 17 ,  func:  (() =>  {
          this.reportNetworkByyear('hcptohcp', 'npi', 'HCP');
          this.arrayData['displayElementRefferalsByyearhcp'] = true;

     })  },
     {  id: 18 ,  func:  (() =>  {
      this.reportNetworkByyear('hcptogrp', 'grp', 'GRP');
      this.arrayData['displayElementRefferalsByyeargrp'] = true;

    }) },
    {  id: 19 ,  func:  (() =>  {
      this.reportNetworkByyear('hcptohco', 'pos', 'HCO');
      this.arrayData['displayElementRefferalsByyearhco'] = true;

    }) },

    {  id: 30 ,  func:  (() =>  {
      this.reportNetworkByyearReceived('relationships_received_quarter_networks', 'hcpfromhcp', 'npi', 'HCP');
      this.arrayData['displayElementReceivedhcp'] = true;

    }) },

    {  id: 31 ,  func:  (() =>  {
      this.reportNetworkByyearReceived('relationships_received_year_networks', 'hcpfromhcp', 'npi', 'HCP');
      this.arrayData['displayElementReceivedhcpyear'] = true;

    }) },

];

// relationships_received_year_networks

mypagegrprefferal = '';
HideColumns = true;
 // Components veritcal
  chooseactivity = [
      { param: 'mdcdrg', tabIndex: REPORT.PATIENTS, func: (() => this.mdcdrgpxVertical.setActivePage(patients)) },
      { param: 'mdcdrg', tabIndex: REPORT.CLAIMS, func: (() => this.mdcdrgpxVertical.setActivePage(claims))},
      { param: 'mdcdrgdx', tabIndex: REPORT.PATIENTS, func: (() => this.mdcdrgdxVertical.setActivePage(patients))},
      { param: 'mdcdrgdx', tabIndex: REPORT.CLAIMS, func: (() => this.mdcdrgdxVertical.setActivePage(claims))},
      { param: 'icd10primarypx', tabIndex: REPORT.PATIENTS, func: (() => this.icd10primarypxVertical.setActivePage(patients))},
      { param: 'icd10primarypx', tabIndex: REPORT.CLAIMS, func: (() => this.icd10primarypxVertical.setActivePage(claims))},
      { param: 'icd10primarydx', tabIndex: REPORT.PATIENTS, func: (() => this.icd10primarydxVertical.setActivePage(patients))},
      { param: 'icd10primarydx', tabIndex: REPORT.CLAIMS, func: (() => this.icd10primarydxVertical.setActivePage(claims))},
      { param: 'anymentionpx', tabIndex: REPORT.PATIENTS, func: (() => this.icd10anypxVertical.setActivePage(patients))},
      { param: 'anymentionpx', tabIndex: REPORT.CLAIMS, func: (() => this.icd10anypxVertical.setActivePage(claims))},
      { param: 'anymentiondx', tabIndex: REPORT.PATIENTS, func: (() => this.icd10anydxVertical.setActivePage(patients))},
      { param: 'anymentiondx', tabIndex: REPORT.CLAIMS, func: (() => this.icd10anydxVertical.setActivePage(claims))},
      { param: 'cpthpcs', tabIndex: REPORT.PATIENTS, func: (() => this.hpcspx.setActivePage(patients))},
      { param: 'cpthpcs', tabIndex: REPORT.CLAIMS, func: (() => this.hpcspx.setActivePage(claims))},
      { param: 'apcpx', tabIndex: REPORT.PATIENTS, func: (() => this.apcpxdash.setActivePage(patients))},
      { param: 'apcpx', tabIndex: REPORT.CLAIMS, func: (() => this.apcpxdash.setActivePage(claims))},
      { param: 'hippsinpa', tabIndex: REPORT.PATIENTS, func: (() => this.hippsdash.setActivePage(patients))},
      { param: 'hippsinpa', tabIndex: REPORT.CLAIMS, func: (() => this.hippsdash.setActivePage(claims))},
      { param: 'hippshome', tabIndex: REPORT.PATIENTS, func: (() => this.hippsdashhome.setActivePage(patients))},
      { param: 'hippshome', tabIndex: REPORT.CLAIMS, func: (() => this.hippsdashhome.setActivePage(claims))},
      { param: 'referralbyquarterhcp', tabIndex: REPORT.DETAIL  , func: (() => {
             this.HideColumns = false;
             this.reportNetwork();
             this.arrayData['displayElementRefferalsByqhcp'] = false;
             this.arrayData['displayElementRefferalsByqhcpsecre'] = true;
      }
      )},
      { param: 'referralbyquarterhcp', tabIndex: REPORT.STANDARD  , func: (() => {
             this.HideColumns = true;
             this.reportNetwork();
             this.arrayData['displayElementRefferalsByqhcp'] = true;
             this.arrayData['displayElementRefferalsByqhcpsecre'] = false;
      }
      )},
      { param: 'referralbyquartergrp', tabIndex: REPORT.DETAIL  , func: (() => {
        this.HideColumns = false;
        this.reportNetwork();
        this.arrayData['displayElementRefferalsByqgrp'] = false;
        this.arrayData['displayElementRefferalsByqgrpsecre'] = true;
        }
      )},
      { param: 'referralbyquartergrp', tabIndex: REPORT.STANDARD  , func: (() => {
        this.HideColumns = true;
        this.reportNetwork();
        this.arrayData['displayElementRefferalsByqgrp'] = true;
        this.arrayData['displayElementRefferalsByqgrpsecre'] = false;
      }
     )},

     { param: 'referralbyquarterhco', tabIndex: REPORT.DETAIL  , func: (() => {
      this.HideColumns = false;
      this.reportNetwork();
      this.arrayData['displayElementRefferalsByqhco'] = false;
      this.arrayData['displayElementRefferalsByqhcosecre'] = true;
    }
     )},
      { param: 'referralbyquarterhco', tabIndex: REPORT.STANDARD  , func: (() => {
        this.HideColumns = true;
        this.reportNetwork();
        this.arrayData['displayElementRefferalsByqhco'] = true;
        this.arrayData['displayElementRefferalsByqhcosecre'] = false;
      }
    )},

    { param: 'referralbyyearhcp', tabIndex: REPORT.DETAIL  , func: (() => {
      this.HideColumns = false;
      this.reportNetworkByyear('hcptohcp', 'npi', 'HCP');
      this.arrayData['displayElementRefferalsByyearhcp'] = false;
      this.arrayData['displayElementRefferalsByyearhcpsecrec'] = true;
    }
     )},

     { param: 'referralbyyearhcp', tabIndex: REPORT.STANDARD  , func: (() => {
      this.HideColumns = true;
      this.reportNetworkByyear('hcptohcp', 'npi', 'HCP');
      this.arrayData['displayElementRefferalsByyearhcp'] = true;
      this.arrayData['displayElementRefferalsByyearhcpsecrec'] = false;
    }
  )},

  { param: 'referralbyyeargrp', tabIndex: REPORT.DETAIL  , func: (() => {
    this.HideColumns = false;
    this.reportNetworkByyear('hcptogrp', 'grp', 'GRP');
    this.arrayData['displayElementRefferalsByyeargrp'] = false;
    this.arrayData['displayElementRefferalsByyeargrpsecrec'] = true;
  }
   )},

   { param: 'referralbyyeargrp', tabIndex: REPORT.STANDARD  , func: (() => {
    this.HideColumns = true;
    this.reportNetworkByyear('hcptogrp', 'grp', 'GRP');
    this.arrayData['displayElementRefferalsByyeargrp'] = true;
    this.arrayData['displayElementRefferalsByyeargrpsecrec'] = false;
  }
  )},

  { param: 'referralbyyearhco', tabIndex: REPORT.DETAIL  , func: (() => {
    this.HideColumns = false;
    this.reportNetworkByyear('hcptohco', 'pos', 'HCO');
    this.arrayData['displayElementRefferalsByyearhco'] = false;
    this.arrayData['displayElementRefferalsByyearhcosecrec'] = true;
  }
   )},

   { param: 'referralbyyeargrp', tabIndex: REPORT.STANDARD  , func: (() => {
    this.HideColumns = true;
    this.reportNetworkByyear('hcptohco', 'pos', 'HCO');
    this.arrayData['displayElementRefferalsByyearhco'] = true;
    this.arrayData['displayElementRefferalsByyearhcosecrec'] = false;
  }
  )},

  { param: 'received_by_quarter', tabIndex: REPORT.DETAIL  , func: (() => {
    this.HideColumns = false;
    this.reportNetworkByyearReceived('relationships_received_quarter_networks', 'hcpfromhcp', 'npi', 'HCP');
    this.arrayData['displayElementReceivedhcp'] = false;
    this.arrayData['displayElementReceivedhcpsecrec'] = true;
  }
   )},

   { param: 'received_by_quarter', tabIndex: REPORT.STANDARD  , func: (() => {
    this.HideColumns = true;
    this.reportNetworkByyearReceived('relationships_received_quarter_networks', 'hcpfromhcp', 'npi', 'HCP');
    this.arrayData['displayElementReceivedhcp'] = true;
    this.arrayData['displayElementReceivedhcpsecrec'] = false;
  }
  )},


  { param: 'received_by_year', tabIndex: REPORT.DETAIL  , func: (() => {
    this.HideColumns = false;
    this.reportNetworkByyearReceived('relationships_received_year_networks', 'hcpfromhcp', 'npi', 'HCP');
    this.arrayData['displayElementReceivedhcpyear'] = false;
    this.arrayData['displayElementReceivedhcpyearsecrec'] = true;
   }
   )},

   { param: 'received_by_year', tabIndex: REPORT.STANDARD  , func: (() => {
    this.HideColumns = true;
    this.reportNetworkByyearReceived('relationships_received_year_networks', 'hcpfromhcp', 'npi', 'HCP');
    this.arrayData['displayElementReceivedhcpyear'] = true;
    this.arrayData['displayElementReceivedhcpyearsecrec'] = false;
  }
  )},

  ];


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

  arrayData = {};
  arrayShowdashboard = showDashboards();
  transdata: any;
 // Provider stream
  dataProvider: ProviderInfoStremGet = new ProviderInfoStremGet();
  // Provider stream

  selectType: string = '';
  pathdashboardspot = '';
  paramdashboardspot  = '';
  valueparam = '';
  selectecho = '';
  lstids = [];
   info: any;
   token: any;
  providerinfo: any;
  currentChildmdcdrg = 0;
  createId;
  generatorOptions;
  idFilters = () => {
    return function*(): any {
        yield  {value: '1', label: 'Activity Report' , searchvalue: ''  },
        yield  {value: '2', label: 'Industry Influence' , searchvalue: 'industry_influence' },
        yield  {value: '3', label: 'Network Relationships', searchvalue: 'referrals_referrals_year'},
        yield  {value: '4', label: 'Workload' , searchvalue: 'workload'},
        yield  {value: '5', label: 'Experience by quarter', searchvalue: 'experience_by_quarter'};
    };
   }


   constructor(private store: Store<AppState>,
               private activatedRoute: ActivatedRoute,
               private storeHeader: Store){
      this.createId = () => this.idFilters()();
      this.generatorOptions = this.createId();

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
                  ))))
                  .subscribe((data) => {
                      if (data.length  === NUMBER_CALLING ){
                        setTimeout(() => {
                          this.tabSelect = tab;
                          this.selectInfobox = params['type'];
                          this.valueparam = params['value'];
                          this.dataArray =  Object.keys(data).map((k) => data[k]);
                          this.loadReport();
                        });
                    }
               });
          }
      });
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
              this.reportsActivity();
              this.changePanel('showactivityReport');
              break;
            case REPORT.INDUSTRY_INFLUENCE:
              this.reportIndustry();
              this.changePanel('showindustryInfluence');
              break;
            case REPORT.NETWORK_RELATIONSHIPS:
              this.reportNetwork();
              this.changePanel('networkRelationships');
              break;
            case REPORT.WORKLOAD:
              this.reportWorkloadExperience('workload');
              this.changePanel('showWorkload');
              break;
            case REPORT.EXPERIENCE_BY_QUARTER:
              this.reportWorkloadExperience('experience_quarter');
              this.changePanel('showExperiencequarter');
              break;
            default:
              break;
          }
          this.store.dispatch(RESET_CHOICE_ELEMENT());
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
               (val.hasOwnProperty('experience_by_quarter') === true && this.lstids.push(this.generatorOptions.next().value));
        });

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
      const selectedoption = options.find((valueopt) =>  this.tabSelect === valueopt.searchvalue.toLowerCase());
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

 }


  getIndexReportList = (identifier, domaincode) =>
            listReport.findIndex((valresports) =>  valresports.identifier === identifier &&
            valresports.domain_code === domaincode)



  setShowPanel  = (typedisplay) => {
    this.arrayData = getDashboards();
    const valueconst = this.changeValueObjectAttribute(this.arrayData , typedisplay, 'true');
    this.arrayData = valueconst;
  }

  reportIndustry = () => {
    if (this.info !== undefined && this.info !== null){
    this.pathdashboardspot = `purplelab/dashboards/${this.info[FIRST].industry_influence.data.tabs[FIRST].identifier}`;
    this.paramdashboardspot = `idvalue="${this.valueparam}";` +
    `DataApiRestUrl="${this.providerinfo[FIRST].IndustryInfluenceDataApiRestUrl}";` +
    `EntityType="${this.info[FIRST].industry_influence.data.tabs[FIRST].name.toLowerCase()}";` +
    `token="${this.token[FIRST].token}";` +
    `key="${this.token[FIRST].key}";`;
    this.setShowPanel('displayElementindustryhcp');
    }
  }

  reportsActivity = () => {
    if (this.info !== undefined && this.info !== null){
    const identifier = this.info[FIRST].activity_report.data[FIRST].tabs[FIRST].identifier;
    const domaincode = this.info[FIRST].activity_report.data[FIRST].tabs[FIRST].domain_code;
    this.createDashboard(identifier, domaincode);
    const myindex = this.getIndexReportList(identifier, domaincode);
    this.setValuesrender(myindex);
    }
  }


  reportNetwork = () => {
    if (this.info !== undefined && this.info !== null){
     const identifier = this.info[FIRST].relationships_referrals.data[FIRST].tabs[FIRST].identifier;
     const domaincode = this.info[FIRST].relationships_referrals.data[FIRST].tabs[FIRST].RelationshipType;
     this.mypagegrprefferal = this.info[FIRST].relationships_referrals.data[FIRST].tabs[FIRST].name;

     this.pathdashboardspot =  `purplelab/dashboards/${this.info[FIRST].relationships_referrals.data[FIRST].tabs[FIRST].identifier}`;
     this.paramdashboardspot = `idvalue="${this.valueparam}";HideColumns="${this.HideColumns}";` +
    `RelationshipType="${this.info[FIRST].relationships_referrals.data[FIRST].tabs[FIRST].RelationshipType}";` +
    `ProviderStreamsLink="${this.info[FIRST].relationships_referrals.data[FIRST].tabs[FIRST].ProviderStreamsLink}";` +
    `DataApiRestUrl="${this.providerinfo[FIRST].RelationshipsDataApiRestUrl}";` +
    `token="${this.token[FIRST].token}";` +
    `key="${this.token[FIRST].key}";SetPage(pageTitle="${this.mypagegrprefferal}");`;
     const myindex = this.getIndexReportList(identifier, domaincode);
     this.setValuesrender(myindex);
    }
  }


  reportNetworkByyear = ( relationtype: string   , type: string , page: string) => {
    this.pathdashboardspot =  `purplelab/dashboards/relationships_referrals_year_networks`;
    this.paramdashboardspot = `idvalue="${this.valueparam}";HideColumns="${this.HideColumns}";` +
    `RelationshipType="${relationtype}";` +
    `ProviderStreamsLink="http://localhost:8080/#/provider_streams?type=${type}&value={$}";` +
    `DataApiRestUrl="${this.providerinfo[FIRST].RelationshipsDataApiRestUrl}";` +
    `token="${this.token[FIRST].token}";` +
    `key="${this.token[FIRST].key}";SetPage(pageTitle="${page}");`;

  }

  reportNetworkByyearReceived = ( urlreport: string  , relationtype: string   , type: string , page: string) => {
    this.pathdashboardspot =  `purplelab/dashboards/${urlreport}`;
    this.paramdashboardspot = `idvalue="${this.valueparam}";HideColumns="${this.HideColumns}";` +
    `RelationshipType="${relationtype}";` +
    `ProviderStreamsLink="http://localhost:8080/#/provider_streams?type=${type}&value={$}";` +
    `DataApiRestUrl="${this.providerinfo[FIRST].RelationshipsDataApiRestUrl}";` +
    `token="${this.token[FIRST].token}";` +
    `key="${this.token[FIRST].key}";SetPage(pageTitle="${page}");`;
  }


  reportWorkloadExperience = ( type: string ) => {
    if (this.info !== undefined && this.info !== null){
      let valueset = '';
      let typedisplay = '';

      switch (this.selectInfobox ) {
        case 'npi':
          valueset = 'hcp';
          break;
        case 'pos':
          valueset = 'hco';
          break;
        case 'grp':
            valueset = 'grp';
            break;
      }
      switch (type) {
        case 'workload':
          typedisplay = 'displayElementworkload';
          this.pathdashboardspot = `purplelab/dashboards/${this.info[FIRST].workload.data.tabs[FIRST].identifier}`;
          this.paramdashboardspot = `idvalue="${this.valueparam}";
           DataApiRestUrl="${this.providerinfo[FIRST].WorkloadDataApiRestUrl}";
           Type="${valueset}";
            ProviderStreamsLink="${this.info[FIRST].workload.data.tabs[FIRST].ProviderStreamsLink}";
           token="${this.token[FIRST].token}";
           key="${this.token[FIRST].key}";SetPage(pageTitle="${valueset}");`;
          break;
        case 'experience_quarter':
          typedisplay = 'displayElementexperiencebyquarter';
          this.pathdashboardspot = `purplelab/dashboards/experience_quarter`;
          this.paramdashboardspot = `idvalue="${this.valueparam}";` +
          `DataApiRestUrl="${this.providerinfo[FIRST].ExperienceByQuarterDataApiRestUrl}";` +
          `Type="${valueset}";ProviderStreamsLink="${this.info[FIRST].experience_by_quarter.data.tabs[FIRST].ProviderStreamsLink}";` +
          `token="${this.token[FIRST].token}";key="${this.token[FIRST].key}";SetPage(pageTitle="${valueset}");`;
          break;
      }
      this.setShowPanel(typedisplay);
    }
  }


  createDashboard = (identifier: string , domaincode: string ) => {
  this.pathdashboardspot = `purplelab/dashboards/${identifier}`;
  this.paramdashboardspot  = `idvalue="${this.valueparam }";` +
  `domaincode="${domaincode}";` +
  `typecode="${this.selectInfobox }";` +
  `DataApiRestUrl="${this.providerinfo[FIRST].ActivityDataApiRestUrl}";` +
  `token="${this.token[FIRST].token}";key="${this.token[FIRST].key}";SetPage(pageTitle="claims");`;
  }


   setValuesrender = (tabIndex: number) => {
    this.arrayData = getDashboards();
    const valueconst = this.changeValueObjectAttribute(this.arrayData , listReport[tabIndex].show, 'true');
    this.arrayData = valueconst;
   }

   createCurrentDashboard = (identifier: string , domaincode: string) => {
    this.createDashboard(identifier, domaincode);
    const myindex = this.getIndexReportList(identifier, domaincode);
    this.setValuesrender(myindex);
   }

   loadCurrentdashboardParent = (typereport: string) => {
    const identifier = this.info[FIRST].activity_report.data.find((valrep) => valrep.tab_group_id === typereport ).tabs[FIRST].identifier;
    const  domaincode = this.info[FIRST].activity_report.data.find((valrep) => valrep.tab_group_id === typereport ).tabs[FIRST].domain_code;
    this.createCurrentDashboard(identifier, domaincode);
   }

   loadCurrentdashboardChild = (identifier: string , domaincode: string ) =>
        this.createCurrentDashboard(identifier, domaincode)

   setCurrentVertical = (tabIndex) =>
       this.arrayfuncvertical.find((valvertical) => valvertical.id === tabIndex).func()


  clickOntabHorizontalParent(tabIndex: number): void {
    let typereport = '';
    this.setCurrentVertical(tabIndex);
    switch (tabIndex) {
      case REPORT.drg:
        typereport = 'drg';
        switch (this.currentChildmdcdrg ) {
           case REPORT.drgdx:
            this.clickOntabHorizontalChildren(REPORT.drgdx);
            break;
           default:
            this.loadCurrentdashboardParent(typereport);
            break;
         }
        break;
      case REPORT.i10:
        typereport = 'i10';
        switch (this.currentChildmdcdrg ) {
          case REPORT.i10pridx:
              this.clickOntabHorizontalChildren(REPORT.i10pridx);
              break;
           case REPORT.i10anypx:
              this.clickOntabHorizontalChildren(REPORT.i10anypx);
              break;
          case REPORT.i10anydx:
              this.clickOntabHorizontalChildren(REPORT.i10anydx);
              break;
          default:
           this.loadCurrentdashboardParent(typereport);
           break;
        }
        break;
      case REPORT.hcpcs:
      typereport = 'hcpcs';
      this.loadCurrentdashboardParent(typereport);
      break;
      case REPORT.apc:
      typereport = 'apc';
      this.loadCurrentdashboardParent(typereport);
      break;
      case REPORT.hipps:
      typereport = 'hipps';
      this.loadCurrentdashboardParent(typereport);
      break;
      case REPORT.relationships_referrals_year_networks:
        break;
    }
  }


  clickOntabHorizontalChildren(tabIndex: number): void {
    let identifier = '';
    let domaincode = '';
    this.setCurrentVertical(tabIndex);
    switch (tabIndex) {
       case REPORT.drgpx:
         identifier = 'activity_report_drg';
         domaincode = 'px';
         break;
      case REPORT.drgdx:
         identifier = 'activity_report_drg';
         domaincode = 'dx';
         break;
      case REPORT.i10pripx:
          identifier = 'activity_report_I10';
          domaincode = 'px';
          break;
      case REPORT.i10pridx:
           identifier = 'activity_report_I10';
           domaincode = 'dx';
           break;
      case REPORT.i10anypx:
           identifier = 'activity_report_I10_Any_Mention';
           domaincode = 'px';
           break;
      case REPORT.i10anydx:
           identifier = 'activity_report_I10_Any_Mention';
           domaincode = 'dx';
           break;
       case REPORT.hippsinp:
          identifier = 'activity_report_hipps_irf';
          domaincode = 'px';
          break;
      case REPORT.hippshome:
          identifier = 'activity_report_hipps_hha';
          domaincode = 'px';
          break;
      case REPORT.referrals_quarter_grp:
          break;

     }
    this.loadCurrentdashboardChild(identifier, domaincode);
    this.currentChildmdcdrg = tabIndex;
  }

  clickOntabVertical(tabIndex: number , param: string = ''): void {
     this.chooseactivity.find((valpages) =>
          valpages.param === param && valpages.tabIndex === tabIndex).func();
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

   this.store.select(getDashboarvalue).subscribe((datadashboard) => {
      setTimeout(() => {

      });
    });
  }
}
