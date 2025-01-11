const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

class SellerInvoice {
  constructor() {
    this.companyDetails = {
      name: "Zenith Dropshipping",
    };
  }

  async createSellerInvoice(data) {
    try {
      let response = [];
      for (let order of data) {
        const orderDetails = order.orderDetails;
        const sellerDetails = order.supplierDetails;

        // Calculate total cost and total items
        const totalCost = orderDetails.reduce((acc, order) => {
          const product = sellerDetails.sellingProducts.find(
            (ele) => ele.sku === order["Lineitem sku"]
          );
          const itemCost = product?.price || 0; // Default to 0 if price not found
          return acc + itemCost * order["Lineitem quantity"];
        }, 0);

        const totalItems = orderDetails.reduce(
          (acc, order) => acc + order["Lineitem quantity"],
          0
        );

        // Add itemCost to each orderDetail object
        orderDetails.forEach((detail) => {
          const product = sellerDetails.sellingProducts.find(
            (ele) => ele.sku === detail["Lineitem sku"]
          );
          detail.itemCostPrice = product?.price || 0;
        });

        for (let order of orderDetails) {
          response.push(await this.extractOrderData(order, sellerDetails));
        }

        const sellerName =
          sellerDetails.supplierName.length > sellerDetails.alternateName.length
            ? sellerDetails.alternateName
            : sellerDetails.supplierName;

        // Create invoice object
        const invoicePayload = {
          company: this.companyDetails.name,
          seller: sellerDetails,
          orderDetails: orderDetails,
          totalCost: totalCost,
          totalItems: totalItems,
          date: this.today(),
          sellerName,
        };

        // Generate HTML content
        const htmlContent = this.convertToHtml(invoicePayload);

        // Launch Puppeteer browser and generate PDF
        const pdfBuffer = await this.generatePdf(htmlContent);

        const fileName = await this.fileName(sellerName);
        await this.savePdfToFile(pdfBuffer, fileName);
      }
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }

  convertToHtml(invoice) {
    const {
      company,
      seller,
      orderDetails,
      totalCost,
      totalItems,
      date,
      sellerName,
    } = invoice;

    return `<!DOCTYPE html><html><head><title>${company} Invoice</title><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet"><style>.container{width:800px;margin:20px auto;padding:20px;border-radius:10px;box-shadow:0 0 8px rgba(0,0,0,.1)}body{font-family:'Poppins',sans-serif;}h1,h3{text-align:center}table{border-collapse:collapse;width:90%;margin:0 auto;margin-top:20px}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background-color:#f2f2f2}.footer{text-align:center;margin-top:20px}.important-message{text-align:center;color:black}</style></head><body><div class="container"><h1>${company}</h1><h3>Phone: 8839203290</h3><table><tr><th>Supplier | GSTIN</th><td>${sellerName} | ${
      seller.gstin
    }</td></tr><tr><th>Phone</th><td>${
      seller.phone
    }</td></tr><tr><th>Total Items</th><td>${totalItems}</td></tr><tr><th>Total Amount</th><td>${(
      totalCost +
      totalItems * seller.packagingCharges
    ).toFixed(
      2
    )}</td></tr><tr><th>Order Date</th><td>${date}</td></tr></table><table><tr><th>Sr. No.</th><th>Order No.</th><th>Product Name</th><th>Qty</th><th>MRP (Incl. Packing)</th><th>Link</th></tr>${orderDetails
      .map(
        (item, index) =>
          `<tr><td>${index + 1}</td><td>${item["Name"]}</td><td>${
            item["Lineitem name"]
          }</td><td>${item["Lineitem quantity"]}</td><td>${
            item.itemCostPrice * item["Lineitem quantity"] +
            seller.packagingCharges * item["Lineitem quantity"]
          }</td><td><a href="${
            item.shippingLabelLink
          }">Box Label</a><br>------<br><a href="${
            item.invoiceLink
          }">Invoice</a></td></tr>`
      )
      .join(
        ""
      )}</table><b><h3>IMPORTANT</h3><p class="important-message">1. Please pack all items within 12-24 hours, for on-time dispatch.<br>2. After packing all items, whatsapp a photo of the packed items to 8839203290.<br>3. Once we receive the packed image, the delivery partner will come for pick-up.</p></b></body></html>`;
  }

  today() {
    const today = new Date();
    const options = { day: "numeric", month: "short", year: "numeric" };
    return today.toLocaleDateString("en-US", options);
  }

  async generatePdf(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: "A4" }); // Set desired PDF format
    await browser.close();
    return pdfBuffer;
  }

  async savePdfToFile(pdfBuffer, filename) {
    try {
      const today = moment().format("DD-MM-YYYY");
      const orderFolderPath = path.join("C:", "dropshipping_orders", today);

      if (!fs.existsSync(orderFolderPath)) {
        await fs.promises.mkdir(orderFolderPath, { recursive: true });
      }

      const filePath = path.join(orderFolderPath, filename);
      await fs.promises.writeFile(filePath, pdfBuffer);
      console.log(`PDF invoice saved to: ${filePath}`);
    } catch (error) {
      console.error("Error saving PDF:", error);
    }
  }

  async fileName(seller) {
    seller = seller.replace(/\s/g, "");
    function formatDate(date) {
      const options = { day: "2-digit", month: "short", year: "numeric" };
      const formattedDate = date.toLocaleDateString("en-US", options);
      return formattedDate.replace(/,/g, "_").replace(/\s+/g, "");
    }
    const today = new Date();
    const formattedToday = formatDate(today);
    return `${seller}_${formattedToday}.pdf`;
  }

  async extractOrderData(orderDetails, supplierDetails) {
    let {
      Name: orderNo,
      "Lineitem sku": sku,
      "Lineitem quantity": quantity = 1, // Set default quantity to 1
      Subtotal: subtotal,
      Taxes: taxes,
      Shipping: shipping,
      Total: total,
      "Billing Name": billingName,
      "Billing Street": billingStreet,
      "Billing Address1": billingAddress1 = billingStreet, // Combine if same
      "Billing City": billingCity,
      "Billing Province": billingProvince,
      "Billing Country": billingCountry,
      "Shipping Name": customerName,
      "Shipping Street": shippingStreet,
      "Shipping Address1": shippingAddress1 = shippingStreet, // Combine if same
      "Shipping City": shippingCity,
      "Shipping Province": shippingProvince,
      "Shipping Country": shippingCountry,
      "Payment Method": paymentMethod,
      "Created at": createdAt,
    } = orderDetails;

    // Handle potential missing or empty values
    subtotal = subtotal || 0;
    taxes = taxes || 0;
    shipping = shipping || 0;
    total = total || 0;

    const billingAddress = `${billingStreet}, ${billingAddress1}, ${billingCity}, ${billingProvince}, ${billingCountry}`;
    const shippingAddress = `${shippingStreet}, ${shippingAddress1}, ${shippingCity}, ${shippingProvince}, ${shippingCountry}`;

    const supplierId = supplierDetails._id;

    return {
      orderNo,
      sku,
      quantity,
      subtotal,
      taxes,
      shipping,
      total,
      billingName,
      billingAddress,
      customerName,
      shippingAddress,
      paymentMethod,
      createdAt,
      supplierId,
    };
  }
}

module.exports = new SellerInvoice();
