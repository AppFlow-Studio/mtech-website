'use server'
import { getFedExToken } from "@/lib/fedex-auth"; // Adjust the import path as needed

export interface CreateShipmentLabelRequest {
        requestedShipment: {
          shipper: {
            contact: {
              personName: string;
              phoneNumber: string;
            };
            address: {
              streetLines: string[];
              city: string;
              stateOrProvinceCode: string;
              postalCode: string;
              countryCode: string;
            };
          };
          recipients: Array<{
            contact?: {
              personName: string;
              phoneNumber: string;
            };
            address?: {
              streetLines: string[];
              city: string;
              stateOrProvinceCode: string;
              postalCode: string;
              countryCode: string;
            };
          }>;
          serviceType: string;
          packagingType: string;
          pickupType: string;
          shippingChargesPayment: {
            paymentType: string;
            payor: {
              responsibleParty: {
                accountNumber: {
                  value: string;
                  key: string;
                };
              };
              address: {
                streetLines: string[];
                city: string;
                stateOrProvinceCode: string;
                postalCode: string;
                countryCode: string;
              };
            };
          };
          labelSpecification: Record<string, any>;
          requestedPackageLineItems: Array<{
            weight: {
              units: string;
              value: string;
            };
          }>;
        };
        accountNumber: {
          value: string;
        };
        labelResponseOptions : "LABEL" | "URL_ONLY"
}

interface CreateShipmentLabelResponse {
    
        transactionId: string;
        customerTransactionId: string;
        output: {
          // number of shipments created
          transactionShipments: Array<{
            serviceType: string;
            shipDatestamp: string;
            serviceCategory: string;
            shipmentDocuments: Array<{
              contentKey: string;
              copiesToPrint: number;
              contentType: string;
              trackingNumber: string;
              docType: string;
              alerts: Array<{
                code: string;
                alertType: string;
                message: string;
              }>;
              encodedLabel: string;
              url: string;
            }>;
            pieceResponses: Array<{
              netChargeAmount: number;
              packageDocuments: Array<{
                contentKey: string;
                copiesToPrint: number;
                contentType: string;
                trackingNumber: string;
                docType: string;
                alerts: Array<{
                  code: string;
                  alertType: string;
                  message: string;
                }>;
                encodedLabel: string;
                url: string;
              }>;
              acceptanceTrackingNumber: string;
              serviceCategory: string;
              listCustomerTotalCharge: string;
              deliveryTimestamp: string;
              trackingIdType: string;
              additionalChargesDiscount: number;
              listRateAmount: number;
              baseRateAmount: number;
              packageSequenceNumber: number;
              netDiscountAmount: number;
              codCollectionAmount: number;
              masterTrackingNumber: string;
              acceptanceType: string;
              trackingNumber: string;
              customerReferences: Array<{
                customerReferenceType: string;
                value: string;
              }>;
            }>;
            serviceName: string;
            alerts: Array<{
              code: string;
              message: string;
            }>;
            completedShipmentDetail: {
              completedPackageDetails: Array<{
                sequenceNumber: number;
                operationalDetail: {
                  astraHandlingText: string;
                  barcodes: {
                    binaryBarcodes: Array<{
                      type: string;
                      value: string;
                    }>;
                    stringBarcodes: Array<{
                      type: string;
                      value: string;
                    }>;
                  };
                  operationalInstructions: Array<{
                    number: number;
                    content: string;
                  }>;
                };
                signatureOption: string;
                trackingIds: Array<{
                  formId: string;
                  trackingIdType: string;
                  uspsApplicationId: string;
                  trackingNumber: string;
                }>;
                groupNumber: number;
                oversizeClass: string;
                packageRating: {
                  effectiveNetDiscount: number;
                  actualRateType: string;
                  packageRateDetails: Array<{
                    ratedWeightMethod: string;
                    totalFreightDiscounts: number;
                    totalTaxes: number;
                    minimumChargeType: string;
                    baseCharge: number;
                    totalRebates: number;
                    rateType: string;
                    billingWeight: {
                      units: string;
                      value: number;
                    };
                    netFreight: number;
                    surcharges: Array<{
                      amount: string;
                      surchargeType: string;
                      level: string;
                      description: string;
                    }>;
                    totalSurcharges: number;
                    netFedExCharge: number;
                    netCharge: number;
                    currency: string;
                  }>;
                };
                dryIceWeight: {
                  units: string;
                  value: number;
                };
                hazardousPackageDetail: {
                  regulation: string;
                  accessibility: string;
                  labelType: string;
                  containers: Array<{
                    QValue: number;
                    hazardousCommodities: Array<{
                      quantity: {
                        quantityType: string;
                        amount: number;
                        units: string;
                      };
                      options: {
                        labelTextOption: string;
                        customerSuppliedLabelText: string;
                      };
                      description: {
                        sequenceNumber: number;
                        packingInstructions: string;
                        subsidiaryClasses: string[];
                        labelText: string;
                        tunnelRestrictionCode: string;
                        specialProvisions: string;
                        properShippingNameAndDescription: string;
                        technicalName: string;
                        symbols: string;
                        authorization: string;
                        attributes: string[];
                        id: string;
                        packingGroup: string;
                        properShippingName: string;
                        hazardClass: string;
                      };
                      netExplosiveDetail: {
                        amount: number;
                        units: string;
                        type: string;
                      };
                      massPoints: number;
                    }>;
                  }>;
                  cargoAircraftOnly: boolean;
                  referenceId: string;
                  radioactiveTransportIndex: number;
                };
              }>;
              operationalDetail: {
                originServiceArea: string;
                serviceCode: string;
                airportId: string;
                postalCode: string;
                scac: string;
                deliveryDay: string;
                originLocationId: string;
                countryCode: string;
                astraDescription: string;
                originLocationNumber: number;
                deliveryDate: string;
                deliveryEligibilities: string[];
                ineligibleForMoneyBackGuarantee: boolean;
                maximumTransitTime: string;
                destinationLocationStateOrProvinceCode: string;
                astraPlannedServiceLevel: string;
                destinationLocationId: string;
                transitTime: string;
                stateOrProvinceCode: string;
                destinationLocationNumber: number;
                packagingCode: string;
                commitDate: string;
                publishedDeliveryTime: string;
                ursaSuffixCode: string;
                ursaPrefixCode: string;
                destinationServiceArea: string;
                commitDay: string;
                customTransitTime: string;
              };
              carrierCode: string;
              completedHoldAtLocationDetail: {
                holdingLocationType: string;
                holdingLocation: {
                  address: {
                    streetLines: string[];
                    city: string;
                    stateOrProvinceCode: string;
                    postalCode: string;
                    countryCode: string;
                    residential: boolean;
                  };
                  contact: {
                    personName: string;
                    emailAddress: string;
                    phoneNumber: string;
                    phoneExtension: string;
                    companyName: string;
                  };
                };
              };
              completedEtdDetail: {
                folderId: string;
                type: string;
                uploadDocumentReferenceDetails: Array<{
                  documentType: string;
                  documentReference: string;
                  description: string;
                  documentId: string;
                }>;
              };
              packagingDescription: string;
              masterTrackingId: {
                formId: string;
                trackingIdType: string;
                uspsApplicationId: string;
                trackingNumber: string;
              };
              serviceDescription: {
                serviceType: string;
                code: string;
                names: Array<{
                  type: string;
                  encoding: string;
                  value: string;
                }>;
                operatingOrgCodes: string[];
                astraDescription: string;
                description: string;
                serviceId: string;
                serviceCategory: string;
              };
              usDomestic: boolean;
              hazardousShipmentDetail: {
                hazardousSummaryDetail: {
                  smallQuantityExceptionPackageCount: number;
                };
                adrLicense: {
                  licenseOrPermitDetail: {
                    number: string;
                    effectiveDate: string;
                    expirationDate: string;
                  };
                };
                dryIceDetail: {
                  totalWeight: {
                    units: string;
                    value: number;
                  };
                  packageCount: number;
                  processingOptions: {
                    options: string[];
                  };
                };
              };
              shipmentRating: {
                actualRateType: string;
                shipmentRateDetails: Array<{
                  rateZone: string;
                  ratedWeightMethod: string;
                  totalDutiesTaxesAndFees: number;
                  pricingCode: string;
                  totalFreightDiscounts: number;
                  totalTaxes: number;
                  totalDutiesAndTaxes: number;
                  totalAncillaryFeesAndTaxes: number;
                  taxes: Array<{
                    amount: number;
                    level: string;
                    description: string;
                    type: string;
                  }>;
                  totalRebates: number;
                  fuelSurchargePercent: number;
                  currencyExchangeRate: {
                    rate: number;
                    fromCurrency: string;
                    intoCurrency: string;
                  };
                  totalNetFreight: number;
                  totalNetFedExCharge: number;
                  shipmentLegRateDetails: Array<{
                    rateZone: string;
                    pricingCode: string;
                    taxes: Array<{
                      amount: number;
                      level: string;
                      description: string;
                      type: string;
                    }>;
                    totalDimWeight: {
                      units: string;
                      value: number;
                    };
                    totalRebates: number;
                    fuelSurchargePercent: number;
                    currencyExchangeRate: {
                      rate: number;
                      fromCurrency: string;
                      intoCurrency: string;
                    };
                    dimDivisor: number;
                    rateType: string;
                    legDestinationLocationId: string;
                    dimDivisorType: string;
                    totalBaseCharge: number;
                    ratedWeightMethod: string;
                    totalFreightDiscounts: number;
                    totalTaxes: number;
                    minimumChargeType: string;
                    totalDutiesAndTaxes: number;
                    totalNetFreight: number;
                    totalNetFedExCharge: number;
                    surcharges: Array<{
                      amount: string;
                      surchargeType: string;
                      level: string;
                      description: string;
                    }>;
                    totalSurcharges: number;
                    totalBillingWeight: {
                      units: string;
                      value: number;
                    };
                    freightDiscounts: Array<{
                      amount: number;
                      rateDiscountType: string;
                      percent: number;
                      description: string;
                    }>;
                    rateScale: string;
                    totalNetCharge: number;
                    totalNetChargeWithDutiesAndTaxes: number;
                    currency: string;
                  }>;
                  dimDivisor: number;
                  rateType: string;
                  surcharges: Array<{
                    amount: string;
                    surchargeType: string;
                    level: string;
                    description: string;
                  }>;
                  totalSurcharges: number;
                  totalBillingWeight: {
                    units: string;
                    value: number;
                  };
                  freightDiscounts: Array<{
                    amount: number;
                    rateDiscountType: string;
                    percent: number;
                    description: string;
                  }>;
                  rateScale: string;
                  totalNetCharge: number;
                  totalBaseCharge: number;
                  totalNetChargeWithDutiesAndTaxes: number;
                  currency: string;
                }>;
              };
              documentRequirements: {
                requiredDocuments: string[];
                prohibitedDocuments: string[];
                generationDetails: Array<{
                  type: string;
                  minimumCopiesRequired: number;
                  letterhead: string;
                  electronicSignature: string;
                }>;
              };
              exportComplianceStatement: string;
              accessDetail: {
                accessorDetails: Array<{
                  password: string;
                  role: string;
                  emailLabelUrl: string;
                  userId: string;
                }>;
              };
            };
            shipmentAdvisoryDetails: {
              regulatoryAdvisory: {
                prohibitions: Array<{
                  derivedHarmonizedCode: string;
                  advisory: {
                    code: string;
                    text: string;
                    parameters: Array<{
                      id: string;
                      value: string;
                    }>;
                    localizedText: string;
                  };
                  commodityIndex: number;
                  source: string;
                  categories: string[];
                  type: string;
                  waiver: {
                    advisories: Array<{
                      code: string;
                      text: string;
                      parameters: Array<{
                        id: string;
                        value: string;
                      }>;
                      localizedText: string;
                    }>;
                    description: string;
                    id: string;
                  };
                  status: string;
                }>;
              };
            };
            masterTrackingNumber: string;
          }>;
          alerts: Array<{
            code: string;
            alertType: string;
            message: string;
          }>;
          jobId: string;
        };
      
}

export async function createShipmentLabel(requestBody: CreateShipmentLabelRequest): Promise<CreateShipmentLabelResponse | Error> {
    const token = await getFedExToken();
    if (!token) {
        throw new Error("Failed to get FedEx access token");
    }
    const FedexShipmentLabelApiRequest = await fetch(`${process.env.NEXT_PUBLIC_FEDEX_API_URL}/ship/v1/shipments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
    });
    const Output = await FedexShipmentLabelApiRequest.json();
    if( Output.errors && Output.errors.length > 0) {
        console.log(Output.errors[0].parameterList)
    }
    if (FedexShipmentLabelApiRequest.ok) {
        return Output;
    } else {
        return new Error("Failed to create shipment label", {
            cause: FedexShipmentLabelApiRequest.statusText
        });
    }
}