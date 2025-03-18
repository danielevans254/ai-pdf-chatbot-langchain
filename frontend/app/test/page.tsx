'use client';

import React, { useState } from 'react';
import JsonViewer from '@/components/json-viewer';
import TableView from '@/components/table-viewer';
import CardView from '@/components/card-viewer';
import DataVisualizer from '@/components/data-visualizer-switch';

const sampleData = {
  "filingInformation": {
    "NameOfCompany": "Automa8e Technologies Pte. Ltd.",
    "UniqueEntityNumber": "202112345A",
    "CurrentPeriodStartDate": "2023-01-01",
    "CurrentPeriodEndDate": "2023-12-31",
    "PriorPeriodStartDate": "2022-01-01",
    "TypeOfXBRLFiling": "Full",
    "NatureOfFinancialStatementsCompanyLevelOrConsolidated": "Company",
    "TypeOfAccountingStandardUsedToPrepareFinancialStatements": "IFRS",
    "DateOfAuthorisationForIssueOfFinancialStatements": "2023-11-11",
    "TypeOfStatementOfFinancialPosition": "Classified",
    "WhetherTheFinancialStatementsArePreparedOnGoingConcernBasis": true,
    "WhetherThereAreAnyChangesToComparativeAmounts": false,
    "DescriptionOfPresentationCurrency": "SGD",
    "DescriptionOfFunctionalCurrency": "SGD",
    "LevelOfRoundingUsedInFinancialStatements": "Units",
    "DescriptionOfNatureOfEntitysOperationsAndPrincipalActivities": "Poultry breeding and hatcheries operations focused on sustainable production.",
    "PrincipalPlaceOfBusinessIfDifferentFromRegisteredOffice": "33 Ubi Avenue 3, #08 Vertex, Singapore 408868",
    "WhetherCompanyOrGroupIfConsolidatedAccountsArePreparedHasMoreThan50Employees": false,
    "NameOfParentEntity": null,
    "NameOfUltimateParentOfGroup": null,
    "TaxonomyVersion": "2022.2",
    "NameAndVersionOfSoftwareUsedToGenerateXBRLFile": "Report Formatter v1.0",
    "HowWasXBRLFilePrepared": "Automated"
  },
  "directorsStatement": {
    "WhetherInDirectorsOpinionFinancialStatementsAreDrawnUpSoAsToExhibitATrueAndFairView": true,
    "WhetherThereAreReasonableGroundsToBelieveThatCompanyWillBeAbleToPayItsDebtsAsAndWhenTheyFallDueAtDateOfStatement": true
  },
  "auditReport": {
    "TypeOfAuditOpinionInIndependentAuditorsReport": "Unqualified",
    "AuditingStandardsUsedToConductTheAudit": null,
    "WhetherThereIsAnyMaterialUncertaintyRelatingToGoingConcern": null,
    "WhetherInAuditorsOpinionAccountingAndOtherRecordsRequiredAreProperlyKept": null
  },
  "statementOfFinancialPosition": {
    "currentAssets": {
      "CashAndBankBalances": 1819470,
      "TradeAndOtherReceivablesCurrent": 8920988,
      "CurrentFinanceLeaseReceivables": 0,
      "CurrentDerivativeFinancialAssets": 0,
      "CurrentFinancialAssetsMeasuredAtFairValueThroughProfitOrLoss": 0,
      "OtherCurrentFinancialAssets": 0,
      "DevelopmentProperties": 0,
      "Inventories": 0,
      "OtherCurrentNonfinancialAssets": 0,
      "NoncurrentAssetsOrDisposalGroupsClassifiedAsHeldForSaleOrAsHeldForDistributionToOwners": 0,
      "CurrentAssets": 10751943
    },
    "nonCurrentAssets": {
      "TradeAndOtherReceivablesNoncurrent": 0,
      "NoncurrentFinanceLeaseReceivables": 0,
      "NoncurrentDerivativeFinancialAssets": 0,
      "NoncurrentFinancialAssetsMeasuredAtFairValueThroughProfitOrLoss": 0,
      "OtherNoncurrentFinancialAssets": 0,
      "PropertyPlantAndEquipment": 202077,
      "InvestmentProperties": 462236,
      "Goodwill": 0,
      "IntangibleAssetsOtherThanGoodwill": 763169,
      "InvestmentsInSubsidiariesAssociatesOrJointVentures": 0,
      "DeferredTaxAssets": 0,
      "OtherNoncurrentNonfinancialAssets": 0,
      "NoncurrentAssets": 1427482
    },
    "Assets": 12179425,
    "currentLiabilities": {
      "TradeAndOtherPayablesCurrent": 3991532,
      "CurrentLoansAndBorrowings": 1866171,
      "CurrentFinancialLiabilitiesMeasuredAtFairValueThroughProfitOrLoss": 0,
      "CurrentFinanceLeaseLiabilities": 1861290,
      "OtherCurrentFinancialLiabilities": 0,
      "CurrentIncomeTaxLiabilities": 1497071,
      "CurrentProvisions": 232448,
      "OtherCurrentNonfinancialLiabilities": 0,
      "LiabilitiesClassifiedAsHeldForSale": 0,
      "CurrentLiabilities": 9469401
    },
    "nonCurrentLiabilities": {
      "TradeAndOtherPayablesNoncurrent": 0,
      "NoncurrentLoansAndBorrowings": 3266237,
      "NoncurrentFinancialLiabilitiesMeasuredAtFairValueThroughProfitOrLoss": 0,
      "NoncurrentFinanceLeaseLiabilities": 408005,
      "OtherNoncurrentFinancialLiabilities": 0,
      "DeferredTaxLiabilities": 0,
      "NoncurrentProvisions": 0,
      "OtherNoncurrentNonfinancialLiabilities": 0,
      "NoncurrentLiabilities": 3674242
    },
    "Liabilities": 13143642,
    "equity": {
      "ShareCapital": 2000,
      "TreasuryShares": 0,
      "AccumulatedProfitsLosses": 959165,
      "ReservesOtherThanAccumulatedProfitsLosses": 0,
      "NoncontrollingInterests": 0,
      "Equity": 957165
    }
  },
  "incomeStatement": {
    "Revenue": 249989,
    "OtherIncome": 2778718,
    "EmployeeBenefitsExpense": 4000,
    "DepreciationExpense": 73584,
    "AmortisationExpense": 185123,
    "RepairsAndMaintenanceExpense": 0,
    "SalesAndMarketingExpense": 0,
    "OtherExpensesByNature": 632646,
    "OtherGainsLosses": 0,
    "FinanceCosts": 296616,
    "ShareOfProfitLossOfAssociatesAndJointVenturesAccountedForUsingEquityMethod": 0,
    "ProfitLossBeforeTaxation": 1798276,
    "TaxExpenseBenefitContinuingOperations": 1016255,
    "ProfitLossFromDiscontinuedOperations": 0,
    "ProfitLoss": 782022,
    "ProfitLossAttributableToOwnersOfCompany": 782022,
    "ProfitLossAttributableToNoncontrollingInterests": 0
  },
  "notes": {
    "tradeAndOtherReceivables": {
      "TradeAndOtherReceivablesDueFromThirdParties": 0,
      "TradeAndOtherReceivablesDueFromRelatedParties": 0,
      "UnbilledReceivables": 0,
      "OtherReceivables": 0,
      "TradeAndOtherReceivables": 8920988
    },
    "tradeAndOtherPayables": {
      "TradeAndOtherPayablesDueToThirdParties": 55707,
      "TradeAndOtherPayablesDueToRelatedParties": 98000,
      "DeferredIncome": 0,
      "OtherPayables": 3837825,
      "TradeAndOtherPayables": 3991532
    },
    "revenue": {
      "RevenueFromPropertyTransferredAtPointInTime": 0,
      "RevenueFromGoodsTransferredAtPointInTime": 244390,
      "RevenueFromServicesTransferredAtPointInTime": 0,
      "RevenueFromPropertyTransferredOverTime": 0,
      "RevenueFromConstructionContractsOverTime": 0,
      "RevenueFromServicesTransferredOverTime": 5599,
      "OtherRevenue": 979,
      "Revenue": 249989
    }
  }
}

const TestPage: React.FC = () => {
  const [viewType, setViewType] = useState<string>('all');

  const renderView = () => {
    switch (viewType) {
      case 'json':
        return <JsonViewer data={sampleData} initialExpanded={true} maxInitialDepth={2} />;
      case 'table':
        return <TableView data={sampleData} />;
      case 'card':
        return <CardView data={sampleData} />;
      case 'tree':
        return <TreeView data={sampleData} />;
      case 'all':
      default:
        return <DataVisualizer data={sampleData} title="Sample Data Visualization" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Data Visualization</h1>

      {/* <div className="mb-6">
        <label htmlFor="view-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Visualization Type:
        </label>
        <select
          id="view-selector"
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 sm:text-sm"
        >
          <option value="all">All Views (with switcher)</option>
          <option value="json">JSON View</option>
          <option value="table">Table View</option>
          <option value="card">Card View</option>
        </select>
      </div> */}

      {renderView()}
    </div>
  );
};

export default TestPage;