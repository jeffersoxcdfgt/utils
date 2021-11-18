import { Component , OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../ app.state';
import {  ADD_COMBO_ELEMENT, RESET_CHOICE_ELEMENT } from 'src/app/redux/header/header.actions';
import { getUrlspotfire, getToken, getProviderinfo } from './redux/provider-stream.reducers';
import {  providerstreamGet , providerstreamInfo, providerstreamToken} from './redux/provider-stream.actions';
import { filter, map, mergeMap, withLatestFrom  } from 'rxjs/operators';
import { MixPanelService } from '../../core/services/external/mixpanel.service';
import { SpotfireDocument } from '@tibco/spotfire-wrapper';
import { GET_CHOICE_SELECTOR } from 'src/app/redux/app.reducer';
import { ProviderStreamsService } from '@core/services/healthnexus-reports/provider-streams.service';


// Table tempo  to cross data with json

const TABLE_ID_FOR_TAB = [
  { tab: 'industry_influence', id_database: 'industry_id'}, // tab=industry_influence
  { tab: 'workload', id_database: 'provider_affiliation_id'}, // tab=workload
  { tab: 'referrals_received_year', id_database: ''},
  // tslint:disable-next-line:max-line-length
  { tab: 'referrals_referrals_quarter', id_database: 'network'}, // tab=referrals_referrals_quarter&subtab1=referred_to_by_quarter_hcp
                                                               // tslint:disable-next-line:max-line-length
                                                              // tab=referrals_referrals_quarter&subtab1=referred_to_by_quarter_hcp&subtab2=referred_to_by_quarter&subtab3=referred_to_by_quarter_grp
                                                              // tslint:disable-next-line:max-line-length
                                                              // tab=referrals_referrals_quarter&subtab1=referred_to_by_quarter_hcp&subtab2=referred_to_by_quarter&subtab3=referred_to_by_quarter_hco

                                                              // tslint:disable-next-line:max-line-length
                                                              // tab=referrals_referrals_quarter&subtab1=referred_to_by_year_hcp&subtab2=referred_to_by_year&subtab3=referred_to_by_year_hcp
                                                              // tslint:disable-next-line:max-line-length
                                                              // tab=referrals_referrals_quarter&subtab1=referred_to_by_year_hcp&subtab2=referred_to_by_year&subtab3=referred_to_by_year_grp
                                                              // tslint:disable-next-line:max-line-length
                                                              // tab=referrals_referrals_quarter&subtab1=referred_to_by_year_hcp&subtab2=referred_to_by_year&subtab3=referred_to_by_year_hco

                                                              // tslint:disable-next-line:max-line-length
                                                              // tab=referrals_referrals_quarter&subtab1=received_to_by_quarter&subtab2=received_to_by_quarter&subtab3=received_to_by_quarter_hcp
                                                              // tslint:disable-next-line:max-line-length
                                                              // tab=referrals_referrals_quarter&subtab1=received_to_by_quarter&subtab2=received_to_by_quarter&subtab3=received_to_by_quarter_hco

                                                              // tslint:disable-next-line:max-line-length
                                                              // tab=referrals_referrals_quarter&subtab1=received_to_by_year&subtab2=received_to_by_year&subtab3=received_to_by_year_hcp
                                                              // tslint:disable-next-line:max-line-length
                                                              // tab=referrals_referrals_quarter&subtab1=received_to_by_year&subtab2=received_to_by_year&subtab3=received_to_by_year_hco
  { tab: 'activity_report', id_database: 'activity_report'},  // tab=activity_report&subtab1=activity_report_drg_grp_px
  { tab: 'experience_by_quarter', id_database: 'experience_by_quarter_id'}, // tab=experience_by_quarter
  { tab: 'rx_activity', id_database: 'ingredient_id'}, // tab=rx_activity
  // tslint:disable-next-line:max-line-length
  { tab: 'quantity_of_services_sub', id_database: 'financials_id'}, // tab=quantity_of_services_sub&subtab1=quantity_id_dash
  // tslint:disable-next-line:max-line-length
  { tab: 'balance_sheet', id_database: ''}, // tab=quantity_of_services_sub&subtab1=quantity_id_dash&subtab2=balance_id&subtab3=balance_sheet_id
  // tslint:disable-next-line:max-line-length
  { tab: 'capital_asset_balances', id_database: ''}, // tab=quantity_of_services_sub&subtab1=quantity_id_dash&subtab2=balance_id&subtab3=captital_asset_balances
  // tslint:disable-next-line:max-line-length
  { tab: 'financial_performance_sub', id_database: ''},  // tab=quantity_of_services_sub&subtab1=quantity_id_dash&subtab2=financial_performance&subtab3=financial_performance_id
  // tslint:disable-next-line:max-line-length
  { tab: 'payer_mix_sub', id_database: ''}, // tab=quantity_of_services_sub&subtab1=quantity_id_dash&subtab2=payer_mix&subtab3=payer_mix_id
  // tslint:disable-next-line:max-line-length
  { tab: 'uncompensated_care_medicaid_and_schip_sub', id_database: ''}, // tab=quantity_of_services_sub&subtab1=quantity_id_dash&subtab2=uncompensated_care_medicaid_and_schip&subtab3=uncompensated_care_medicaid_and_schip_id
  { tab: 'prices_sub', id_database: 'prices_charges_cost_and_others'}, // tab=prices_sub&subtab1=prices_id
  // tslint:disable-next-line:max-line-length
  { tab: 'charges_inpatient_by_cost_center', id_database: ''}, // tab=prices_sub&subtab1=prices_id&subtab2=charges_id&subtab3=charges_inpatient_by_cost_center
  // tslint:disable-next-line:max-line-length
  { tab: 'charges_outpatient_by_cost_center', id_database: ''}, // tab=prices_sub&subtab1=prices_id&subtab2=charges_id&subtab3=charges_outpatient_by_cost_center
  // tslint:disable-next-line:max-line-length
  { tab: 'cost_to_charge_ratios_by_cost_center', id_database: ''},  // tab=prices_sub&subtab1=prices_id&subtab2=cost_id&subtab3=cost_to_charge_ratios_by_cost_center
  // tslint:disable-next-line:max-line-length
  { tab: 'costs_by_cost_center' , id_database: ''}, // tab=prices_sub&subtab1=prices_id&subtab2=cost_id&subtab3=costs_by_cost_center
  // tslint:disable-next-line:max-line-length
  { tab: 'costs_inpatient_by_cost_center', id_database: ''}, // tab=prices_sub&subtab1=prices_id&subtab2=cost_id&subtab3=costs_inpatient_by_cost_center
  // tslint:disable-next-line:max-line-length
  { tab: 'costs_outpatient_by_cost_center', id_database: ''}, // tab=prices_sub&subtab1=prices_id&subtab2=cost_id&subtab3=costs_outpatient_by_cost_center
  // tslint:disable-next-line:max-line-length
  { tab: 'medicare_charges_costs_and_revenues', id_database: ''},  // tab=prices_sub&subtab1=prices_id&subtab2=cost_id&subtab3=medicar_charges_costs_and_revenues
  // tslint:disable-next-line:max-line-length
  { tab: 'revenues_expenses_and_income_sub', id_database: ''},  // tab=prices_sub&subtab1=prices_id&subtab2=revenues_expenses_and_income&subtab3=revenues_expenses_and_income_id
  { tab: 'general_characteristics', id_database: 'general_id'}, // tab=general_characteristics
  { tab: 'trial_affiliation', id_database: 'trial_affiliation_id'} // tab=trial_affiliation
];

const NUMBER_CALLING = 3;
const FIRST = 0;
const DEFAULT_DASHBOARD = '1200px';
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
   Address: string = '';
   Phone: string = '';
}

@Component({
  selector: 'app-provider-stream',
  templateUrl: './provider-stream.component.html',
  styleUrls: ['./provider-stream.component.scss']
})

export  class ProviderStreamComponent implements OnInit  {
  cust  = {
    showAbout: false,
    showAnalysisInformationTool: false,
    showAuthor: false,
    showClose: false,
    showCustomizableHeader: false,
    showDodPanel: false,
    showExportFile: false,
    showExportVisualization: false,
    showFilterPanel: true,
    showHelp: false,
    showLogout: false,
    showPageNavigation: false,
    showReloadAnalysis: false,
    showStatusBar: false,
    showToolBar: false,
    showUndoRedo: false
  };
  document: SpotfireDocument = null;
  showspotfire = false;
  paramscon;
  res;
  urlproccu;
  pathcurrpr;
  paramprocu;
  pathcurrpro;
  dataApiRestUrl;
  tokencur;
  keycur;
  properties = [{}];
  list = [];
  listaux = [];

  selectInfobox = 'grp';
  dataProvider = new ProviderInfoStremGet();
  datatree = [
    {
        id: 'activity_report',
        title: 'Dx/Px Activity',
        children: [
            {
                id: 'drg',
                title: 'MDC - DRG',
                children: [
                    {
                        id: 'activity_report_drg_grp_px',
                        title: 'PX',
                        dashboard_path: 'purplelab/dashboards/provider_streams/activity/activity_report_drg',
                        dashboard_parameters: 'idvalue="{idvalue}";domaincode="px";typecode="{typecode}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="claims");',
                        pages: [
                          {
                            title: 'Patients View',
                            page: 'patients',
                            default: true
                          },
                          {
                            title: 'Claims View',
                            page: 'claims',
                            default: true
                          }
                        ],
                    },
                    {
                        id: 'activity_report_drg_grp_dx',
                        title: 'DX',
                        dashboard_path: 'purplelab/dashboards/provider_streams/activity/activity_report_drg',
                        dashboard_parameters: 'idvalue="{idvalue}";domaincode="dx";typecode="{typecode}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="claims");',
                        pages: [
                          {
                            title: 'Patients View',
                            page: 'patients',
                            default: true
                          },
                          {
                            title: 'Claims View',
                            page: 'claims',
                            default: true
                          }
                        ],
                    }
                ]
            },
            {
                id: 'i10',
                title: 'ICD 10',
                children: [
                    {
                        id: 'primary_principle_grp_px',
                        title: 'Primary Principle PX',
                        dashboard_path: 'purplelab/dashboards/provider_streams/activity/activity_report_I10',
                        dashboard_parameters: 'idvalue="{idvalue}";domaincode="px";typecode="{typecode}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="claims");',
                        pages: [
                          {
                            title: 'Patients View',
                            page: 'patients',
                            default: true
                          },
                          {
                            title: 'Claims View',
                            page: 'claims',
                            default: true
                          }
                        ],
                    },
                    {
                        id: 'primary_principle_grp_dx',
                        title: 'Primary Principle DX',
                        dashboard_path: 'purplelab/dashboards/provider_streams/activity/activity_report_I10',
                        dashboard_parameters: 'idvalue="{idvalue}";domaincode="dx";typecode="{typecode}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="claims");',
                        pages: [
                          {
                            title: 'Patients View',
                            page: 'patients',
                            default: true
                          },
                          {
                            title: 'Claims View',
                            page: 'claims',
                            default: true
                          }
                        ],
                    },
                    {
                        id: 'any_mention_grp_px',
                        title: 'Any Mention PX',
                        dashboard_path: 'purplelab/dashboards/provider_streams/activity/activity_report_I10_Any_Mention',
                        dashboard_parameters: 'idvalue="{idvalue}";domaincode="px";typecode="{typecode}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="claims");',
                        pages: [
                          {
                            title: 'Patients View',
                            page: 'patients',
                            default: true
                          },
                          {
                            title: 'Claims View',
                            page: 'claims',
                            default: true
                          }
                        ],
                    },
                    {
                        id: 'any_mention_grp_dx',
                        title: 'Any Mention DX',
                        dashboard_path: 'purplelab/dashboards/provider_streams/activity/activity_report_I10_Any_Mention',
                        dashboard_parameters: 'idvalue="{idvalue}";domaincode="dx";typecode="{typecode}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="claims");',
                        pages: [
                          {
                            title: 'Patients View',
                            page: 'patients',
                            default: true
                          },
                          {
                            title: 'Claims View',
                            page: 'claims',
                            default: true
                          }
                        ],
                    }
                ]
            },
            {
              id: 'hcpcs_grp_px',
              title: 'CPT HPCS',
              children: [
                {
                  id: 'hcpcs',
                  title: 'PX',
                  dashboard_path: 'purplelab/dashboards/provider_streams/activity/activity_report_hcpcs',
                  dashboard_parameters: 'idvalue="{idvalue}";domaincode="px";typecode="{typecode}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="claims");',
                  pages: [
                    {
                      title: 'Patients View',
                      page: 'patients',
                      default: true
                    },
                    {
                      title: 'Claims View',
                      page: 'claims',
                      default: true
                    }
                  ],
                }
              ]
            },
            {
              id: 'apc_grp_px',
              title: 'APC',
              children: [
                {
                  id: 'apc',
                  title: 'PX',
                  dashboard_path: 'purplelab/dashboards/provider_streams/activity/activity_report_apc',
                  dashboard_parameters: 'idvalue="{idvalue}";domaincode="px";typecode="{typecode}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="claims");',
                  pages: [
                    {
                      title: 'Patients View',
                      page: 'patients',
                      default: true
                    },
                    {
                      title: 'Claims View',
                      page: 'claims',
                      default: true
                    }
                  ],
                }
              ]
            },
            {
              id: 'activity_report_hipps',
              title: 'HIPPS',
              children: [
                {
                  id: 'activity_report_hipps_hha_grp_px',
                  title: 'Inpatient Rehab Facility PX',
                  dashboard_path: 'purplelab/dashboards/provider_streams/activity/activity_report_hipps_irf',
                  dashboard_parameters: 'idvalue="{idvalue}";domaincode="px";typecode="{typecode}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="claims");',
                  pages: [
                    {
                      title: 'Patients View',
                      page: 'patients',
                      default: true
                    },
                    {
                      title: 'Claims View',
                      page: 'claims',
                      default: true
                    }
                  ],
                },
                {
                  id: 'activity_report_hipps_irf_grp_px',
                  title: 'Home Health Agency PX',
                  dashboard_path: 'purplelab/dashboards/provider_streams/activity/activity_report_hipps_hha',
                  dashboard_parameters: 'idvalue="{idvalue}";domaincode="px";typecode="{typecode}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="claims");',
                  pages: [
                    {
                      title: 'Patients View',
                      page: 'patients',
                      default: true
                    },
                    {
                      title: 'Claims View',
                      page: 'claims',
                      default: true
                    }
                  ],
                },
                {
                  id: 'activity_report_hipps_snf_grp_px',
                  title: 'Skilled Nursing Facility PX',
                  dashboard_path: 'purplelab/dashboards/provider_streams/activity/activity_report_hipps_snf',
                  dashboard_parameters: 'idvalue="{idvalue}";domaincode="px";typecode="{typecode}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="claims");',
                  pages: [
                    {
                      title: 'Patients View',
                      page: 'patients',
                      default: true
                    },
                    {
                      title: 'Claims View',
                      page: 'claims',
                      default: true
                    }
                  ],
                }
              ]
            }

        ]
    },
    {
      id: 'network',
      title: 'Network',
      children: [
        {
          id: 'referred_to_by_quarter',
          title: 'Referred To By Quarter',
          children: [
            {
              id: 'referred_to_by_quarter_hcp',
              title: 'HCP',
              dashboard_path: 'purplelab/dashboards/provider_streams/relationships/relationships_referrals_quarter_networks',
              dashboard_parameters: 'idvalue="{idvalue}";HideColumns="true";RelationshipType="hcptohcp"; ProviderStreamsLink="https://dev.purplelab.com/#/provider_streams?type=npi&value={$}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="HCP");',
              pages: [
                {
                  title: 'Standard View',
                  page: true,
                  default: true
                },
                {
                  title: 'Detail View',
                  page: false,
                  default: false
                }
              ],
            },
            {
              id: 'referred_to_by_quarter_grp',
              title: 'GRP',
              dashboard_path: 'purplelab/dashboards/provider_streams/relationships/relationships_referrals_quarter_networks',
              dashboard_parameters: 'idvalue="{idvalue}";HideColumns="true";RelationshipType="hcptogrp"; ProviderStreamsLink="https://dev.purplelab.com/#/provider_streams?type=grp&value={$}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="GRP");',
              children: [],
              pages: [
                {
                  title: 'Standard View',
                  page: true,
                  default: true
                },
                {
                  title: 'Detail View',
                  page: false,
                  default: false
                }
              ],
            },
            {
              id: 'referred_to_by_quarter_hco',
              title: 'HCO',
              dashboard_path: 'purplelab/dashboards/provider_streams/relationships/relationships_referrals_quarter_networks',
              dashboard_parameters: 'idvalue="{idvalue}";HideColumns="true";RelationshipType="hcotohco"; ProviderStreamsLink="https://dev.purplelab.com/#/provider_streams?type=pos&value={$}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="HCO");',
              children: [],
              pages: [
                {
                  title: 'Standard View',
                  page: true,
                  default: true
                },
                {
                  title: 'Detail View',
                  page: false,
                  default: false
                }
              ],
            }
          ]
        },
        {
          id: 'referred_to_by_year',
          title: 'Referred To By year',
          children: [
            {
              id: 'referred_to_by_year_hcp',
              title: 'HCP',
              dashboard_path: 'purplelab/dashboards/provider_streams/relationships/relationships_referrals_year_networks',
              dashboard_parameters: 'idvalue="{idvalue}";HideColumns="true";RelationshipType="hcptohcp"; ProviderStreamsLink="https://dev.purplelab.com/#/provider_streams?type=npi&value={$}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="HCP");',
              children: [],
              pages: [
                {
                  title: 'Standard View',
                  page: true,
                  default: true
                },
                {
                  title: 'Detail View',
                  page: false,
                  default: false
                }
              ],
            },
            {
              id: 'referred_to_by_year_grp',
              title: 'GRP',
              dashboard_path: 'purplelab/dashboards/provider_streams/relationships/relationships_referrals_year_networks',
              dashboard_parameters: 'idvalue="{idvalue}";HideColumns="true";RelationshipType="hcptogrp"; ProviderStreamsLink="https://dev.purplelab.com/#/provider_streams?type=grp&value={$}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="GRP");',
              children: [],
              pages: [
                {
                  title: 'Standard View',
                  page: true,
                  default: true
                },
                {
                  title: 'Detail View',
                  page: false,
                  default: false
                }
              ],
            },
            {
              id: 'referred_to_by_year_hco',
              title: 'HCO',
              dashboard_path: 'purplelab/dashboards/provider_streams/relationships/relationships_referrals_year_networks',
              dashboard_parameters: 'idvalue="{idvalue}";HideColumns="true";RelationshipType="hcotohco"; ProviderStreamsLink="https://dev.purplelab.com/#/provider_streams?type=pos&value={$}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="HCO");',
              children: [],
              pages: [
                {
                  title: 'Standard View',
                  page: true,
                  default: true
                },
                {
                  title: 'Detail View',
                  page: false,
                  default: false
                }
              ],
            }
          ]
        },
        {
          id: 'received_to_by_quarter',
          title: 'Received To By quarter',
          children: [
            {
              id: 'received_to_by_quarter_hcp',
              title: 'HCP',
              dashboard_path: 'purplelab/dashboards/provider_streams/relationships/relationships_received_quarter_networks',
              dashboard_parameters: 'idvalue="{idvalue}";HideColumns="true";RelationshipType="hcpfromhco"; ProviderStreamsLink="https://dev.purplelab.com/#/provider_streams?type=npi&value={$}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="HCP");',
              children: [],
              pages: [
                {
                  title: 'Standard View',
                  page: true,
                  default: true
                },
                {
                  title: 'Detail View',
                  page: false,
                  default: false
                }
              ],
            },
            {
              id: 'received_to_by_quarter_hco',
              title: 'HCO',
              dashboard_path: 'purplelab/dashboards/provider_streams/relationships/relationships_received_quarter_networks',
              dashboard_parameters: 'idvalue="{idvalue}";HideColumns="true";RelationshipType="hcofromhco"; ProviderStreamsLink="https://dev.purplelab.com/#/provider_streams?type=pos&value={$}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="HCO");',
              children: [],
              pages: [
                {
                  title: 'Standard View',
                  page: true,
                  default: true
                },
                {
                  title: 'Detail View',
                  page: false,
                  default: false
                }
              ],
            }
          ]
        },
        {
          id: 'received_to_by_year',
          title: 'Received To By year',
          children: [
            {
              id: 'received_to_by_year_hcp',
              title: 'HCP',
              dashboard_path: 'purplelab/dashboards/provider_streams/relationships/relationships_received_year_networks',
              dashboard_parameters: 'idvalue="{idvalue}";HideColumns="true";RelationshipType="hcpfromhco"; ProviderStreamsLink="https://dev.purplelab.com/#/provider_streams?type=npi&value={$}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="HCP");',
              children: [],
              pages: [
                {
                  title: 'Standard View',
                  page: true,
                  default: true
                },
                {
                  title: 'Detail View',
                  page: false,
                  default: false
                }
              ],
            },
            {
              id: 'received_to_by_year_hco',
              title: 'HCO',
              dashboard_path: 'purplelab/dashboards/provider_streams/relationships/relationships_received_year_networks',
              dashboard_parameters: 'idvalue="{idvalue}";HideColumns="true";RelationshipType="hcofromhco"; ProviderStreamsLink="https://dev.purplelab.com/#/provider_streams?type=pos&value={$}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";SetPage(pageTitle="HCO");',
              children: [],
              pages: [
                {
                  title: 'Standard View',
                  page: true,
                  default: true
                },
                {
                  title: 'Detail View',
                  page: false,
                  default: false
                }
              ],
            }
          ]
        }

      ]
    },
    {
      id: 'industry_id',
      title: 'Industry Influence',
      children: [
        {
          id: 'industry_id_dash',
          title: 'HCP',
          children: [
            {
              id: 'industry_id_dash_child',
              title: 'Industry',
              dashboard_path: 'purplelab/dashboards/provider_streams/industry_influence/industry_influence_networks',
              dashboard_parameters: 'idvalue="{idvalue}";EntityType="{typereg}";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";'
            }
          ]
        }
      ]
    },
    {
      id: 'provider_affiliation_id',
      title: 'Provider affiliation',
      children: [
        {
          id: 'provider_affiliation_id_dash',
          title: 'Provider Affiliation',
          children: [
            {
              id: 'provider_affiliation_id_child',
              title: 'Provider Affiliation',
              dashboard_path: 'purplelab/dashboards/provider_streams/workload/workload_networks',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";ProviderStreamsLink="https://dev.purplelab.com/#/provider_streams?type=npi&value={$}";token="{token}";key="{key}";SetPage(pageTitle="{typereg}");'
            }
          ],
        }
      ]
    },
    {
      id: 'experience_by_quarter_id',
      title: 'Experience by quarter',
      children: [
        {
          id: 'experience_by_quarter_id_dash',
          title: 'Experience by quarter',
          children: [
            {
              id: 'experience_by_quarter_id_child',
              title: 'Experience by quarter',
              dashboard_path: 'purplelab/dashboards/provider_streams/experience_quarter/experience_quarter',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";key="{key}";SetPage(pageTitle="{typereg}");',

            }
          ]
        }
      ]
    },
    {
      id: 'trial_affiliation_id',
      title: 'Clinical Trial Participation',
      children: [
        {
          id: 'trial_affiliation_id_dash',
          title: 'HCP',
          children: [
            {
              id: 'trial_affiliation_id_child',
              dashboard_path: 'purplelab/dashboards/provider_streams/trial_affilations/investigator_streams',
              dashboard_parameters: 'idvalue="{idvalue}";ProviderStreamsLink="";DataApiRestUrl="{data_api_rest_url}";token="{token}";key="{key}";',

            }
          ]
        }
      ]
    },
    {
      id: 'ingredient_id',
      title: 'Rx Activity',
      children: [
        {
          id: 'ingredient_id_dash',
          title: 'Ingredient',
          children: [
            {
              id: 'ingredient_id_child',
              title: 'Ingredient',
              dashboard_path: 'purplelab/dashboards/provider_streams/activity/rx_activity',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";key="{key}";SetPage(pageTitle="hco_overall");',
            }
          ]
        }
      ]
    },
    {
      id: 'financials_id',
      title: 'Financials',
      children: [
        {
          id: 'quantity_id',
          title: 'Quantity',
          children: [
            {
            id: 'quantity_id_dash',
            title: 'Quantity of services',
            dashboard_path: 'purplelab/dashboards/provider_streams/financials/quantity_of_services',
            dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Quantity of services";Report2="";key="{key}";SetPage(pageTitle="Quantity of services");',
          }
        ]
        },
        {
          id: 'balance_id',
          title: 'Balances',
          children: [
            {
                id: 'balance_sheet_id',
                title: 'Balance Sheet',
                dashboard_path: 'purplelab/dashboards/provider_streams/financials/balance_sheet',
                dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Balance Sheet";Report2="";key="{key}";SetPage(pageTitle="Balance Sheet");',
                children: []
            },
            {
                id: 'captital_asset_balances',
                title: 'Capital Asset Balances ',
                dashboard_path: 'purplelab/dashboards/provider_streams/financials/capital_asset_balances',
                dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Capital asset balances";Report2="";key="{key}";SetPage(pageTitle="Capital asset balances");',
            }
        ]

        },
        {
          id: 'financial_performance',
          title: 'Financial performance',
          children: [
            {
              id: 'financial_performance_id',
              title: 'Financial performance',
              dashboard_path: 'purplelab/dashboards/provider_streams/financials/financial_performance',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Financial performance";Report2="";key="{key}";SetPage(pageTitle="Financial performance");',
              children: []
            }
          ]
        },
        {
          id: 'payer_mix',
          title: 'Payer Mix',
          children: [
            {
              id: 'payer_mix_id',
              title: 'Payer Mix',
              dashboard_path: 'purplelab/dashboards/provider_streams/financials/payer_mix',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Payer mix";Report2="";key="{key}";SetPage(pageTitle="Payer mix");',
              children: []
            }
          ]
        },
        {
          id: 'uncompensated_care_medicaid_and_schip',
          title: 'Uncompensated Care, Medicaid, and  SCHIP',
          children: [
            {
              id: 'uncompensated_care_medicaid_and_schip_id',
              title: 'Uncompensated Care, Medicaid, and  SCHIP',
              dashboard_path: 'purplelab/dashboards/provider_streams/financials/uncompensated_care,medicaid,and_schip',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Uncompensated care, Medicaid, and SCHIP";Report2="";key="{key}";SetPage(pageTitle="Uncompensated care, Medicaid, and SCHIP");',
              children: []
            }
          ]
        }

      ]

    },
    {
      id: 'general_id',
      title: 'General Characteristics',
      children: [
        {
          id: 'general_id_dash',
          title: 'General Characteristics',
          children: [
            {
              id: 'general_id_child',
              title: 'General',
              dashboard_path: '/purplelab/dashboards/provider_streams/financials/general_characteristics',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="General characteristics";Report2="";key="{key}";SetPage(pageTitle="General characteristics");',
            }
          ]
        }
      ]
    },
    {
      id: 'prices_charges_cost_and_others',
      title: 'Prices, Charges, Cost & Others',
      children: [
        {
          id: 'prices_charges_cost_and_others_id',
          title: 'Prices',
          children: [
            {
              id: 'prices_id',
              title: 'Prices',
              dashboard_path: '/purplelab/dashboards/provider_streams/financials/prices',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Prices";Report2="";key="{key}";SetPage(pageTitle="Prices");',
              children: []
            }
          ]
        },
        {
          id: 'charges_id',
          title: 'Charges',
          children: [
            {
              id: 'charges_inpatient_by_cost_center',
              title: 'Charges Inpatient By Cost Center',
              dashboard_path: '/purplelab/dashboards/provider_streams/financials/charges,in_out_patients,by_cost_center',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Charges, inpatient, by cost center";Report2="inpatient";key="{key}";SetPage(pageTitle="Charges, inpatient, by cost center");',
               children: []
            },
            {
              id: 'charges_outpatient_by_cost_center',
              title: 'Charges Outpatient By Cost Center',
              dashboard_path: '/purplelab/dashboards/provider_streams/financials/charges,in_out_patients,by_cost_center',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Charges, outpatient, by cost center";Report2="outpatient";key="{key}";SetPage(pageTitle="Charges, outpatient, by cost center");',
              children: []
            }
          ]
        },
        {
          id: 'cost_id',
          title: 'Cost',
          children: [
            {
              id: 'cost_to_charge_ratios_by_cost_center',
              title: 'Cost to charge ratios by cost center',
              dashboard_path: '/purplelab/dashboards/provider_streams/financials/cost_to_charge_ratios,by_cost_center',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Cost-to-charge ratios, by cost center";Report2="";key="{key}";SetPage(pageTitle="Cost-to-charge ratios, by cost center");',
              children: []
            },
            {
              id: 'costs_by_cost_center',
              title: 'Costs, by Cost Center',
              dashboard_path: '/purplelab/dashboards/provider_streams/financials/cost,by_cost_center',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Costs, by cost center";Report2="";key="{key}";SetPage(pageTitle="Costs, by cost center");',
              children: []
            },
            {
              id: 'costs_inpatient_by_cost_center',
              title: 'Costs, Inpatient, by Cost Center',
              dashboard_path: '/purplelab/dashboards/provider_streams/financials/costs,in_out_patient,by_cost_center',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Costs, inpatient, by cost center";Report2="inpatient";key="{key}";SetPage(pageTitle="Costs, inpatient, by cost center");',
              children: []
            },
            {
              id: 'costs_outpatient_by_cost_center',
              title: 'Costs, Outpatient, by Cost Center',
              dashboard_path: '/purplelab/dashboards/provider_streams/financials/costs,in_out_patient,by_cost_center',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Costs, outpatient, by cost center";Report2="outpatient";key="{key}";SetPage(pageTitle="Costs, outpatient, by cost center");',
              children: []
            },
            {
              id: 'medicar_charges_costs_and_revenues',
              title: 'Medicare Charges, Costs and Revenues',
              dashboard_path: '/purplelab/dashboards/provider_streams/financials/medicare_charges,costs,and_revenues',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Medicare charges, costs, and revenues";Report2="";key="{key}";SetPage(pageTitle="Medicare charges, costs, and revenues");',
              children: []
            }
          ]
        },
        {
          id: 'revenues_expenses_and_income',
          title: 'Revenues, Expenses and Income',
          children: [
            {
              id: 'revenues_expenses_and_income_id',
              title: 'Revenues, Expenses and Income',
              dashboard_path: '/purplelab/dashboards/provider_streams/financials/revenues,expenses_and_income',
              dashboard_parameters: 'idvalue="{idvalue}";DataApiRestUrl="{data_api_rest_url}";Type="{typereg}";token="{token}";Report="Revenues, expenses and income";Report2="";key="{key}";SetPage(pageTitle="Revenues, expenses and income");',
              children: []
            }
          ]

        }
      ]
    }
  ];
  noData =  true;
  heightdashboard = DEFAULT_DASHBOARD;
  currentnodecom = 0;
  // listpages  = ['Patients View','Claims View']
  listpages  = [];
  listindexpages = [];
  parentTabId = 0;
  childTabId = 0;
  currentchild;
  HideColumns = true;
  nodecurrfirst;
  selectOpt = 'activity_report';
  typereg = '';
  messageNodata = 'Loading data ....';
  showLoading = true;

  constructor(private store: Store<AppState>,
              private activatedRoute: ActivatedRoute,
              private storeHeader: Store,
              private providerStreamsService: ProviderStreamsService
              ){ }

  ngOnInit(): void{
    this.chooseOption();
    this.getTypeId();
  }


  getTypeId(): void {
      this.activatedRoute.queryParams.subscribe(params => {
        const codevalue = params['value'];
        const typecode = params['type'];
        const payload = {
          typecode,
          codevalue,
          report: 'provider_streams'
        };
        new Promise((resolve) => {
          this.providerStreamsService.get_tabs_with_data_tree(payload).subscribe((data) => {
            // console.log(data, 'jefferson');
            resolve(null);
          });
        })
        .then(() => {
          this.store.dispatch(providerstreamGet());
          this.store.dispatch(providerstreamToken());
          this.paramscon = params;
          this.tabSelect(this.paramscon['tab']);
          this.typeRegister(this.paramscon['type']);
          this.store.dispatch(providerstreamInfo({codevalue, typecode}));
          const dataobs = this.store.select(getUrlspotfire).pipe(
            mergeMap(() => this.store.select(getProviderinfo)),
            withLatestFrom(this.store.select(getToken)),
            map(([first, second]) => first.concat(second)),
            filter((elem) => elem.length === NUMBER_CALLING)
          );

          const Initinformation = new Promise((resolve) => {
            dataobs.subscribe(mydata => resolve(mydata));
          });

          Initinformation.then((val: any) => this.getInitInfo(val));
        });
      });
   }

   tabSelect(tab: any): void{
    if (tab !== '' && tab !== undefined){
      const nodefortab = TABLE_ID_FOR_TAB.find((tabcurr) => tabcurr.tab === this.paramscon['tab']);
      const id_database = nodefortab.id_database;
      this.selectOpt = id_database;
      const nodeForId = this.datatree.filter((iddata) => iddata.id === id_database );

      if (nodeForId[0] && nodeForId[FIRST].children.length === 1){
        const mynode = nodeForId[FIRST].children[FIRST];
        if (mynode && mynode.children.length > FIRST){
          this.nodecurrfirst = mynode.children[FIRST];
        }
        this.list  = nodeForId;
      }
      else{
        if (this.paramscon['subtab1'] !== '' && this.paramscon['subtab1'] !== undefined){
          let opdash =  this.paramscon['subtab1'];
          const nodetree =  this.datatree.filter((noinf) => noinf.id === id_database);
          this.currentnodecom = this.datatree.findIndex((tree) => tree.id === id_database);


          if (nodetree[FIRST] && nodetree[FIRST].children.length > 0){
            this.convertTreeToList(this.datatree, '0');
            this.list = nodetree[0].children;

            if (this.paramscon['subtab2'] !== '' &&
              this.paramscon['subtab2'] !== undefined &&
              this.paramscon['subtab3']  !== '' &&
              this.paramscon['subtab3'] !== undefined
            ){
              this.parentTabId = this.list.findIndex((lstda) => lstda.id === this.paramscon['subtab2']);
              opdash = this.paramscon['subtab3'];
              const chilsub = this.list[this.parentTabId];
              this.childTabId = chilsub.children.findIndex((inflst) => inflst.id === this.paramscon['subtab3']);
            }

            const tempMyObj  = JSON.parse(JSON.stringify(this.listaux));
            const res = this.convertListToTree(tempMyObj, '0');
            const element = res[this.currentnodecom];
            this.nodecurrfirst = this.searchTree(element, opdash);

            if ( this.nodecurrfirst.pages &&  this.nodecurrfirst.pages.length > 0){
              this.createPages(this.nodecurrfirst);
            }

          }

        }
      }
      const options = this.datatree.map((val) => ({ value: val.id, label: val.title}));
      this.createOptions(options);
      /*this.convertTreeToList(this.datatree, '0');
      const tempMyObj  = JSON.parse(JSON.stringify(this.list));
      const forId = tempMyObj.filter((iddata) => iddata.id === id_database )*/
      /*const res = this.convertListToTree(tempMyObj, '0');
      const element = res[0];
      const result = this.searchTree(element, 'primary_principle_grp_px');*/

    }
    else{
      this.convertTreeToList(this.datatree, '0');
      const tempMyObj  = JSON.parse(JSON.stringify(this.list));
      const res = this.convertListToTree(tempMyObj, '0');

      if (this.datatree.length > FIRST){
        const nodecurr = this.getFirstNodeTree(this.datatree[FIRST]);
        this.nodecurrfirst = nodecurr;
        this.createPages(nodecurr);
        const options = this.datatree.map((val) => ({ value: val.id, label: val.title}));
        this.createOptions(options);
        this.list = res[0].children;
      }
    }
   }

   typeRegister(strvalue: string): void{
      switch (strvalue) {
        case 'npi':
          this.typereg = 'hcp';
          break;
        case 'pos':
          this.typereg = 'hco';
          break;
        case 'grp':
          this.typereg = 'grp';
          break;
      }

   }

   getInitInfo(val: any): void{

    this.selectInfobox = this.paramscon.type;
    const datainfo = val.find((inf) => inf.hasOwnProperty('info'));
    this.dataApiRestUrl = datainfo.DataApiRestUrl;

    if ( typeof datainfo.info === 'string' ){
        this.noData = datainfo.info === 'no data' ? true : false;
        this.messageNodata = 'There is no data available';
        return;
    }
    else{
      this.noData = false;
    }



    // Set provider data  Npi
    this.dataProvider.Name =  datainfo.info.hasOwnProperty('Name') ?  datainfo.info.Name :  '';
    this.dataProvider.Npi = this.paramscon.value;
    this.dataProvider.Taxonomycode =  datainfo.info.hasOwnProperty('Taxonomy Code') ? datainfo.info['Taxonomy Code'] : '';
    this.dataProvider.Type =  datainfo.info.hasOwnProperty('Type') ? datainfo.info.Type :  '';
    this.dataProvider.PCPorspecyype  =  datainfo.info.hasOwnProperty('PCP or Spec Type') ? datainfo.info['PCP or Spec Type'] :  '';
    this.dataProvider.Prefspecialtydescription  = datainfo.info.hasOwnProperty('Pref Specialty Description') ? datainfo.info['Pref Specialty Description'] :  '';
    this.dataProvider.Providersegmenttype = datainfo.info.hasOwnProperty('Provider Segment Type') ? datainfo.info['Provider Segment Type'] :  '';
    // Set provider data  Npi

    // Set provider data  Grp
    this.dataProvider.Organization  = datainfo.info.hasOwnProperty('Organization') ? datainfo.info['Organization'] :  '';
    // Set provider data  Grp

    // Set provider data  Pos
    this.dataProvider.Facility = datainfo.info.hasOwnProperty('Facility') ? datainfo.info['Facility'] :  '';
    this.dataProvider.Category = datainfo.info.hasOwnProperty('Category') ? datainfo.info.Category :  '';
    this.dataProvider.Subtype = datainfo.info.hasOwnProperty('SubType') ? datainfo.info.SubType :  '';
    this.dataProvider.PLorgcareclasstype = datainfo.info.hasOwnProperty('PL Orgcare Class type') ? datainfo.info['PL Orgcare Class type'] : '';
    this.dataProvider.PLorgcareclasssubtype = datainfo.info.hasOwnProperty('PL Orgcare Class Subtype') ? datainfo.info['PL Orgcare Class Subtype'] : '';
    // Set provider data  Pos

    const res = val.reduce((before, after) => ({...before, ...after }));
    this.res = res;
    this.tokencur = res.token;
    this.keycur = res.key;
    const stringdash = this.formatStringDashboard(this.nodecurrfirst.dashboard_parameters);
    this.urlproccu = `https://${res.server}`;
    this.pathcurrpro = this.nodecurrfirst.dashboard_path;
    this.paramprocu = stringdash;
    this.showspotfire = true;
   }




  onMarking = (e: Event) => {
    this.getProperties();
    this.showLoading = false;
  }


  createOptions(options): void{
    this.store.dispatch(ADD_COMBO_ELEMENT({
      options,
      isVisibleOpt: true,
      selectOpt: this.selectOpt,
    }));

  }

  getProperties = () => this.document.getDocumentProperties$().subscribe(s => {
    this.properties = s;
    const height: any = this.properties.find((pro) => pro['name'] === 'height');
    this.heightdashboard = height && height.hasOwnProperty('value') ? height.value : '1000px';
  }
)

setProperty = () => {
  // this.document.setDocumentProperty('Description', WONDERS[Math.floor(Math.random() * 8)]);
  // this.document.getDocumentProperty$('Description').subscribe(w => console.log('Description contains', w));
  // refresh properties
  // app.analysisDocument.setActivePage(page);
  // this.document.setActivePage("patients")
  // this.getProperties();
}


  chooseOption = () => {
    this.storeHeader.select(GET_CHOICE_SELECTOR).subscribe(res => {
      if (res.choice !== ''){
        this.showLoading =  true;
        this.currentnodecom = this.datatree.findIndex((tree) => tree.id === res.choice);
        this.convertTreeToList(this.datatree, '0');
        const tempMyObj  = JSON.parse(JSON.stringify(this.list));
        const datares = this.convertListToTree(tempMyObj, '0');
        this.list = [];
        this.listpages  = [];
        this.listindexpages  = [];
        this.showspotfire = false;
        let listcombo;
        setTimeout(() => {
          this.list = datares[this.currentnodecom].children;
          listcombo = this.list;
          if (listcombo && listcombo.length > FIRST){
            const nodeOne = listcombo[FIRST];
            if (nodeOne.children && nodeOne.children.length > FIRST){
              const child1 = nodeOne.children[FIRST];
              this.currentchild =  child1;
              this.scrollToCard(50);
              this.createPages(child1);
              const dashstring = this.formatStringDashboard(child1.dashboard_parameters);
              this.executeDashboard(child1.dashboard_path, dashstring);
            }
          }
        }, 3000);
      }

      // this.store.dispatch(RESET_CHOICE_ELEMENT());
  });
  }

  selectedParentIndexChange(event): void{
    this.showLoading =  true;
    this.scrollToCard(200);
    const nodedash = this.datatree[this.currentnodecom];
    if (nodedash && nodedash.children && nodedash.children.length > 0){
      const firstnode = nodedash.children[event];
      if (firstnode && firstnode.children && firstnode.children.length > 0){
          const currentdashboard: any = firstnode.children[0];
          this.createPages(currentdashboard);
          const dashstring = this.formatStringDashboard(currentdashboard.dashboard_parameters);
          this.executeDashboard(currentdashboard.dashboard_path, dashstring);

      }
    }
  }


  clickOntabVertical(event): void{
    if (this.listindexpages && this.listindexpages.length > 0){
      const page = this.listindexpages[event];

      if (typeof page === 'boolean') {
        // variable is a boolean
        let regexExp ;
        let stringdata;

        if (this.HideColumns){
          regexExp =  /HideColumns="true"/g;
          stringdata = 'HideColumns="false"';
          this.HideColumns = false;
        }
        else{
          regexExp =  /HideColumns="false"/g;
          stringdata = 'HideColumns="true"';
          this.HideColumns = true;
        }
        const dashstring = this.formatStringDashboard(this.currentchild.dashboard_parameters);
        const stringEnd = dashstring.replace(regexExp, stringdata);
        this.executeDashboard(this.currentchild.dashboard_path, stringEnd);
      }
      else{
        this.document.setActivePage(page);
      }
    }
  }

  createPages(nodecur: any): void {
    this.listpages  = [];
    this.listindexpages  = [];
    setTimeout(() => {
      if (nodecur.pages && nodecur.pages.length > 0){
        this.listpages = nodecur.pages.map((pag) => pag.title);
        this.listindexpages = nodecur.pages.map((pag) => pag.page);
      }
    }, 3000);
  }

  selectedChildIndexChange(event: number, id: string): void{
    this.showLoading =  true;
    const result = this.searchTree(this.datatree[this.currentnodecom], id);
    if (result.children && result.children.length > 0){
      const child = result.children[event];
      this.createPages(child);
      const dashstring = this.formatStringDashboard(child.dashboard_parameters);
      this.executeDashboard(child.dashboard_path, dashstring);
      this.scrollToCard(200);
    }
  }

  executeDashboard(pathdashboard: string , paramdashboard: string): void{
    this.showspotfire = false;
    setTimeout(() => {
      this.pathcurrpro = pathdashboard;
      this.paramprocu = paramdashboard;
      this.showspotfire = true;
    }, 3000);
  }


  formatStringDashboard(str: string): string{
    str = str.replace(/{idvalue}/g, this.paramscon['value']);
    str = str.replace(/{typecode}/g, this.paramscon['type']);
    str = str.replace(/{data_api_rest_url}/g, this.dataApiRestUrl);
    str = str.replace(/{token}/g, this.tokencur);
    str = str.replace(/{key}/g, this.keycur);
    str = str.replace(/{typereg}/g, this.typereg);
    return str;
  }



  // Tree operations

  getFirstNodeTree(tree: any): any{
    if (tree.children && tree.children.length ) {
        const res = this.getFirstNodeTree(tree.children[0]);
        return res;
    }
    return tree;
  }

  convertTreeToList(arr , parentid): void {
    for (const indexele in arr) {
      if (arr[indexele].children && arr[indexele].children.length ) {
          this.convertTreeToList(arr[indexele].children, arr[indexele].id);
          const nodeparent = { id: arr[indexele].id, title: arr[indexele].title , parent: parentid };
          this.list.push(nodeparent);
          this.listaux.push(nodeparent);
      }
      else{
        const rows = arr.map((row) => ({ id: row.id, title: row.title, dashboard_path: row.dashboard_path,
          dashboard_parameters: row.dashboard_parameters, pages: row.pages , parent: parentid}));
        this.list.push(...rows);
        this.listaux.push(...rows);
        return;
      }
    }
  }



  searchTree(element, matchingid): any{
    if (element.id === matchingid){
         return element;
    }else if (element.children != null){
         let i;
         let result = null;
         for (i = 0; result == null && i < element.children.length; i++){
              result = this.searchTree(element.children[i], matchingid);
         }
         return result;
    }
    return null;
  }

  convertListToTree(arr, parent): any {
    const out = [];
    for (const i in arr) {
          if (arr[i].parent === parent) {
            const children = this.convertListToTree(arr, arr[i].id);

            if (children.length) {
              arr[i].children = children;
            }

            out.push(arr[i]);
          }
        }
    return out;
  }

  // Tree operations

  // Scroll function
  scrollToCard(topcur: number): void {
    window.scrollTo({top: topcur, behavior: 'smooth'});
  }

}
