'use strict';

/*global module */


var configuration = {};
configuration.businessSystems = [];
configuration.messages = [];

// Request for quotation AvailCheck (CP -> CRM -> WH1/2)
// Sales order / transportorder (CP -> CRM -> WH1/2 -> Distr)
// Transport request (WH1/2 > Distribution > CRM)
// Sales order confirmation (CRM > CP)
// Delivery note (Distribution > CRM > CP) 


var msgRFQ_CP = {
	"id": "msgRFQ_CP",
	"description": "Req for Quotation",
	"senderID": "B2BPRTL",
	"senderAccessRule": null,
	"senderSecureStoreID": null,
	"senderReqMethod": "POST",
	"senderPath": "/bp/api/rfq",
	"messageProcessing": [],
	"receiverID": "CRM",
	"receiverEndpoint": "default",
	"receiverAccessRule": null,
	"receiverSecureStoreID": null,
	"receiverReqMethod": null,
	"receiverPath": null,
	"receiverPathKeepParameters": true,
};

var msgAVC_DW1 = {
	"id": "msgAVC_DW1",
	"description": "Availability check",
	"senderID": "CRM",
	"senderAccessRule": null,
	"senderSecureStoreID": null,
	"senderReqMethod": "POST",
	"senderPath": "/whgron/atp",
	"messageProcessing": [],
	"receiverID": "WHGRONNL",
	"receiverEndpoint": "default",
	"receiverAccessRule": null,
	"receiverSecureStoreID": null,
	"receiverReqMethod": null,
	"receiverPath": null,
	"receiverPathKeepParameters": true,
};

var msgAVC_DW2 = {
	"id": "msgAVC_DW2",
	"description": "Availability check",
	"senderID": "CRM",
	"senderAccessRule": null,
	"senderSecureStoreID": null,
	"senderReqMethod": "GET",
	"senderPath": "/whvlis/atp",
	"messageProcessing": [],
	"receiverID": "WHVLISNL",
	"receiverEndpoint": "default",
	"receiverAccessRule": null,
	"receiverSecureStoreID": null,
	"receiverReqMethod": null,
	"receiverPath": null,
	"receiverPathKeepParameters": true,
};


// Sales order / tpo (CP -> CRM -> WH1/2 -> Distr)

var msgSO_CP = {
	"id": "msgSO_CP",
	"description": "Salesorder",
	"senderID": "B2BPRTL",
	"senderAccessRule": null,
	"senderSecureStoreID": null,
	"senderReqMethod": "POST",
	"senderPath": "/bp/api/so",
	"messageProcessing": [],
	"receiverID": "CRM",
	"receiverEndpoint": "default",
	"receiverAccessRule": null,
	"receiverSecureStoreID": null,
	"receiverReqMethod": null,
	"receiverPath": null,
	"receiverPathKeepParameters": true,
};


var msgTPO_WH1 = {
	"id": "msgTPO_WH1",
	"description": "transportorder",
	"senderID": "CRM",
	"senderAccessRule": null,
	"senderSecureStoreID": null,
	"senderReqMethod": "POST",
	"senderPath": "/anywh/avc/transportorder1",
	"messageProcessing": [],
	"receiverID": "WHGRONNL",
	"receiverEndpoint": "default",
	"receiverAccessRule": null,
	"receiverSecureStoreID": null,
	"receiverReqMethod": null,
	"receiverPath": null,
	"receiverPathKeepParameters": true,
};


var msgTPO_WH2 = {
	"id": "msgTPO_WH2",
	"description": "transportorder1",
	"senderID": "CRM",
	"senderAccessRule": null,
	"senderSecureStoreID": null,
	"senderReqMethod": "POST",
	"senderPath": "/whvlis/tpo",
	"messageProcessing": [],
	"receiverID": "WHVLISNL",
	"receiverEndpoint": "default",
	"receiverAccessRule": null,
	"receiverSecureStoreID": null,
	"receiverReqMethod": null,
	"receiverPath": null,
	"receiverPathKeepParameters": true,
};


// Transport request (WH1/2 > Distribution > CRM)
// Delivery note (Distribution > CRM > CP) 
var msgTPReq_WH1 = {
	"id": "msgTPReq_WH1",
	"description": "TransportRequest Groningen",
	"senderID": "WHGRONNL",
	"senderAccessRule": null,
	"senderSecureStoreID": null,
	"senderReqMethod": "POST",
	"senderPath": "/api/rft",
	"messageProcessing": [],
	"receiverID": "DISRTR",
	"receiverEndpoint": "default",
	"receiverAccessRule": null,
	"receiverSecureStoreID": null,
	"receiverReqMethod": null,
	"receiverPath": null,
	"receiverPathKeepParameters": true,
};

var msgTPReq_WH2 = {
	"id": "msgTPReq_WH2",
	"description": "TransportRequest Vlissingen",
	"senderID": "WHVLISNL",
	"senderAccessRule": null,
	"senderSecureStoreID": null,
	"senderReqMethod": "POST",
	"senderPath": "/api/rft",
	"messageProcessing": [],
	"receiverID": "DISRTR",
	"receiverEndpoint": "default",
	"receiverAccessRule": null,
	"receiverSecureStoreID": null,
	"receiverReqMethod": null,
	"receiverPath": null,
	"receiverPathKeepParameters": true,
};


// Sales order confirmation (CRM > CP)

var msgConfirm_SO = {
	"id": "msgConfirm_SO",
	"description": "Salesorder confirmation",
	"senderID": "CRM",
	"senderAccessRule": null,
	"senderSecureStoreID": null,
	"senderReqMethod": "PUT",
	"senderPath": "/api/confirmSO",
	"messageProcessing": [],
	"receiverID": "B2BPRTL",
	"receiverEndpoint": "default",
	"receiverAccessRule": null,
	"receiverSecureStoreID": null,
	"receiverReqMethod": null,
	"receiverPath": null,
	"receiverPathKeepParameters": true,
};


var msgConfirm_TP = {
	"id": "msgConfirm_TP",
	"description": "Notification of transport",
	"senderID": "CRM",
	"senderAccessRule": null,
	"senderSecureStoreID": null,
	"senderReqMethod": "PUT",
	"senderPath": "/api/confirmTP",
	"messageProcessing": [],
	"receiverID": "B2BPRTL",
	"receiverEndpoint": "default",
	"receiverAccessRule": null,
	"receiverSecureStoreID": null,
	"receiverReqMethod": null,
	"receiverPath": null,
	"receiverPathKeepParameters": true,
};


// Delivery note (Distribution > CRM > CP) 
var msgDELIV_CP = {
	"id": "msgDELIV_CP",
	"description": "Delivery note",
	"senderID": "CRM",
	"senderAccessRule": null,
	"senderSecureStoreID": null,
	"senderReqMethod": "POST",
	"senderPath": "/api/deliverynotes",
	"messageProcessing": [],
	"receiverID": "B2BPRTL",
	"receiverEndpoint": "default",
	"receiverAccessRule": null,
	"receiverSecureStoreID": null,
	"receiverReqMethod": null,
	"receiverPath": null,
	"receiverPathKeepParameters": true,
};

var msgDELIV_CRM = {
	"id": "msgDELIV_CRM",
	"description": "Delivery note",
	"senderID": "DISRTR",
	"senderAccessRule": null,
	"senderSecureStoreID": null,
	"senderReqMethod": "POST",
	"senderPath": "/distribution/api/deliverynotes",
	"messageProcessing": [],
	"receiverID": "CRM",
	"receiverEndpoint": "default",
	"receiverAccessRule": null,
	"receiverSecureStoreID": null,
	"receiverReqMethod": null,
	"receiverPath": null,
	"receiverPathKeepParameters": true,
};

configuration.messages.push(msgRFQ_CP, msgAVC_DW1, msgAVC_DW2, msgTPO_WH1, msgTPO_WH2, msgDELIV_CRM,
	msgDELIV_CP, msgConfirm_TP, msgConfirm_SO, msgTPReq_WH2, msgTPReq_WH1, msgSO_CP);

var B2BPRTL = {
	"id": "B2BPRTL",
	"description": "B2B Portal",
	ReceiverEndpoints: []
};

B2BPRTL.ReceiverEndpoints.push({
	"id": "default",
	"description": "default endpoint",
	"host": "localhost",
	"port": 30000
});

var CRM = {
	"id": "CRM",
	"description": "CRM system",
	ReceiverEndpoints: []
};

CRM.ReceiverEndpoints.push({
	"id": "default",
	"description": "default endpoint",
	"host": "localhost",
	"port": 30001
});

var WHVLISNL = {
	"id": "WHVLISNL",
	"description": "Warehouse Vlissingen",
	ReceiverEndpoints: []
};

WHVLISNL.ReceiverEndpoints.push({
	"id": "default",
	"description": "default endpoint",
	"host": "localhost",
	"port": 30002
});

var WHGRONNL = {
	"id": "WHGRONNL",
	"description": "Warehouse Groningen",
	ReceiverEndpoints: []
};

WHGRONNL.ReceiverEndpoints.push({
	"id": "default",
	"description": "default endpoint",
	"host": "localhost",
	"port": 30003
});

var DISRTR = {
	"id": "DISRTR",
	"description": "van Hoven Logistics",
	ReceiverEndpoints: []
};

DISRTR.ReceiverEndpoints.push({
	"id": "default",
	"description": "default endpoint",
	"host": "localhost",
	"port": 30004
});

configuration.businessSystems.push(B2BPRTL, CRM, WHVLISNL, WHGRONNL, DISRTR);

module.exports = configuration;