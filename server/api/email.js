const nodemailer = require('nodemailer');

const pw = process.env.EMAIL_PW || require('../../secrets').EMAIL_PW;
const email =
  process.env.EMAIL_ADDRESS || require('../../secrets').EMAIL_ADDRESS;

export const sendInitialEmail = (
  alias,
  userName,
  requesteeEmail,
  eventName,
  item,
  price,
  paypalLink,
  transactionDate
) => {
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    secure: true,
    port: 465,
    auth: {
      user: email,
      pass: pw,
    },
  });

  const emailOptions = {
    from: email,
    to: `${requesteeEmail}`,
    subject: `You have received a payment request from ${userName}`,
    html: `<html>
  <head>
    <title>You have received a payment request</title>
    <link
      rel="important stylesheet"
      href="chrome://messagebody/skin/messageBody.css"
    />
  </head>
  <body>
    <html dir="ltr">
      <head>
        <meta http-equiv="Content-Type" content="text/html; " />
        <meta
          name="viewport"
          content="initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,width=device-width,height=device-height,target-densitydpi=device-dpi,user-scalable=no"
        />
        <title>You have received a payment request</title>
        <style type="text/css">
          /**
 *Fonts
 */
          @font-face {
            font-family: PayPal-Sans;
            font-style: normal;
            font-weight: 400;
            src: local('PayPalSansSmall-Regular'),
              url('https://www.paypalobjects.com/ui-web/paypal-sans-small/1-0-0/PayPalSansSmall-Regular.eot');
            /* IE9 Compat Modes */
            src: local('PayPalSansSmall-Regular'),
              url('https://www.paypalobjects.com/ui-web/paypal-sans-small/1-0-0/PayPalSansSmall-Regular.woff2')
                format('woff2'),
              /* Moderner Browsers */
                url('https://www.paypalobjects.com/ui-web/paypal-sans-small/1-0-0/PayPalSansSmall-Regular.woff')
                format('woff'),
              /* Modern Browsers */
                url('https://www.paypalobjects.com/ui-web/paypal-sans-small/1-0-0/PayPalSansSmall-Regular.svg#69ac2c9fc1e0803e59e06e93859bed03')
                format('svg');
            /* Legacy iOS */
            /* Fallback font for - MS Outlook older versions (2007,13, 16)*/
            mso-font-alt: 'Calibri';
          }

          @font-face {
            font-family: PayPal-Sans;
            font-style: normal;
            font-weight: 500;

            src: local('PayPalSansSmall-Medium'),
              url('https://www.paypalobjects.com/ui-web/paypal-sans-small/1-0-0/PayPalSansSmall-Medium.eot');
            /* IE9 Compat Modes */
            src: local('PayPalSansSmall-Medium'),
              url('https://www.paypalobjects.com/ui-web/paypal-sans-small/1-0-0/PayPalSansSmall-Medium.woff2')
                format('woff2'),
              /* Moderner Browsers */
                url('https://www.paypalobjects.com/ui-web/paypal-sans-small/1-0-0/PayPalSansSmall-Medium.woff')
                format('woff'),
              /* Modern Browsers */
                url('https://www.paypalobjects.com/ui-web/paypal-sans-small/1-0-0/PayPalSansSmall-Medium.svg#69ac2c9fc1e0803e59e06e93859bed03')
                format('svg');
            /* Legacy iOS */
            /* Fallback font for - MS Outlook older versions (2007,13, 16)*/
            mso-font-alt: 'Calibri';
          }

          /* End - PayPal Fonts */

          /**
 * VX-LIB Styles
 * Import only the styles required for Email templates.
 */
          @charset "UTF-8";

          html {
            box-sizing: border-box;
          }

          *,
          *:before,
          *:after {
            box-sizing: inherit;
          }

          /* Setting these elements to height of 100% ensures that
 * .vx_foreground-container fully covers the whole viewport
 */
          html,
          body {
            height: 100%;
          }

          /**
 * @fileOverview Contains type treatment for PayPal's new VX Patterns
 * @name type-vxPtrn
 * @author jlowery
 * @notes The below styles are mobile first
 */
          body {
            font-size: inherit !important;
            font-family: 'PayPal-Sans', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-smoothing: antialiased;
          }

          a,
          a:visited {
            color: #0070ba;
            text-decoration: none;
            font-weight: 500;
            font-family: 'PayPal-Sans', Calibri, Trebuchet, Arial, sans-serif;
          }

          a:active,
          a:focus,
          a:hover {
            color: #005ea6;
            text-decoration: underline;
          }

          p,
          li,
          dd,
          dt,
          label,
          input,
          textarea,
          pre,
          code {
            font-size: 0.9375rem;
            line-height: 1.6;
            font-weight: 400;
            text-transform: none;
            font-family: 'PayPal-Sans', Calibri, Trebuchet, Arial, sans-serif;
          }

          .vx_legal-text {
            font-size: 0.8125rem;
            line-height: 1.38461538;
            font-weight: 400;
            text-transform: none;
            font-family: 'PayPal-Sans', sans-serif;
            color: #6c7378;
          }

          /* End - VX-LIB Styles */

          /**
 * Styles from Neptune
 */
          /* prevent iOS font upsizing */
          * {
            -webkit-text-size-adjust: none;
          }

          /* force Outlook.com to honor line-height */
          .ExternalClass * {
            line-height: 100%;
          }

          td {
            mso-line-height-rule: exactly;
          }

          /* prevent iOS auto-linking */
          /* Android margin fix */
          body {
            margin: 0;
            padding: 0;
            font-family: 'PayPal-Sans', Calibri, Trebuchet, Arial, sans-serif !important;
            background: '#f2f2f2';
            color: '#2c2e2f';
          }

          div[style*='margin: 16px 0'] {
            margin: 0 !important;
          }

          /** Prevent Outlook Purple Links **/
          .greyLink a:link {
            color: #949595;
          }

          /* prevent iOS auto-linking */
          .applefix a {
            /* use on a span around the text */
            color: inherit;
            text-decoration: none;
          }

          .ppsans {
            font-family: 'PayPal-Sans', Calibri, Trebuchet, Arial, sans-serif !important;
          }

          /* use to make image scale to 100 percent */
          .mpidiv img {
            width: 100%;
            height: auto;
            min-width: 100%;
            max-width: 100%;
          }

          .stackTbl {
            width: 100%;
            display: table;
          }

          .greetingText {
            padding: 0px 20px;
          }

          /* Responsive CSS */
          @media screen and (max-width: 640px) {
            /*** Image Width Styles ***/
            .imgWidth {
              width: 20px !important;
            }
          }

          @media screen and (max-width: 480px) {
            /*** Image Width Styles ***/
            .imgWidth {
              width: 10px !important;
            }

            .greetingText {
              padding: 0;
            }
          }

          /* End - Responsive CSS */

          /* Fix for Neptune partner logo */
          .partner_image {
            max-width: 250px;
            max-height: 90px;
            display: block;
          }

          /* End - Styles from Neptune */
        </style>
      </head>

      <body>
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          width="100%"
          class="marginFix"
        >
          <tbody>
            <tr>
              <td
                bgcolor="#ffffff"
                class="mobMargin"
                style="font-size: 0px"
              ></td>
              <td
                bgcolor="#ffffff"
                width="660"
                align="center"
                class="mobContent"
              >
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  dir="ltr"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                          width="100%"
                        >
                          <tbody>
                            <tr>
                              <td
                                align="center"
                                colspan="3"
                                class="greetingText"
                                width="600"
                              >
                                <table
                                  width="100%"
                                  cellpadding="0"
                                  cellspacing="0"
                                  border="0"
                                  bgcolor="#f5f7fa"
                                  dir="ltr"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          font-size: 14px;
                                          line-height: 18px;
                                          color: #687173;
                                          padding: 20px;
                                        "
                                      >
                                        Hello, ${alias}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" valign="bottom">
                                        <img
                                          data-testid="circletop-image"
                                          src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/dark-mode/pplogo-circletop-sm.png"
                                          width="116"
                                          height="16"
                                          style="display: block"
                                          border="0"
                                          alt=""
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td class="mobMargin"></td>
                              <td align="center" width="600">
                                <img
                                  src="https://u.cubeupload.com/payuppal/logo.png"
                                  width="116"
                                  height="71"
                                  style="display: block"
                                  border="0"
                                  alt="PayPal"
                                  title="PayPal"
                                />
                              </td>
                              <td class="mobMargin"></td>
                            </tr>
                            <tr>
                              <td
                                class="mobMargin"
                                align="center"
                                valign="top"
                                style="min-width: 10px"
                                bgcolor="#004f9b"
                              >
                                <img
                                  width="100%"
                                  height="81"
                                  class="imgWidth"
                                  src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-sidebar-left-top.jpg"
                                  style="display: block"
                                  border="0"
                                  alt=""
                                />
                              </td>
                              <td align="center" width="600">
                                <table
                                  width="100%"
                                  cellpadding="0"
                                  cellspacing="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        width="12"
                                        align="center"
                                        valign="top"
                                      >
                                        <img
                                          width="12"
                                          height="81"
                                          src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/dark-mode/header-left-corner.png"
                                          style="display: block"
                                          border="0"
                                          alt=""
                                        />
                                      </td>
                                      <td
                                        width="229"
                                        align="center"
                                        valign="top"
                                      >
                                        <img
                                          width="100%"
                                          height="81"
                                          src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/dark-mode/header-left.png"
                                          style="display: block"
                                          border="0"
                                          alt=""
                                        />
                                      </td>
                                      <td
                                        width="118"
                                        align="center"
                                        valign="top"
                                      >
                                        <img
                                          width="118"
                                          height="81"
                                          src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/dark-mode/header-center-circle.png"
                                          style="display: block"
                                          border="0"
                                          alt=""
                                        />
                                      </td>
                                      <td
                                        width="229"
                                        align="center"
                                        valign="top"
                                      >
                                        <img
                                          width="100%"
                                          height="81"
                                          src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/dark-mode/header-right.png"
                                          style="display: block"
                                          border="0"
                                          alt=""
                                        />
                                      </td>
                                      <td
                                        width="12"
                                        align="center"
                                        valign="top"
                                      >
                                        <img
                                          width="12"
                                          height="81"
                                          src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/dark-mode/header-right-corner.png"
                                          style="display: block"
                                          border="0"
                                          alt=""
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td
                                class="mobMargin"
                                align="center"
                                valign="top"
                                style="min-width: 10px"
                                bgcolor="#004f9b"
                              >
                                <img
                                  width="100%"
                                  height="81"
                                  class="imgWidth"
                                  src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-sidebar-right-top.jpg"
                                  style="display: block"
                                  border="0"
                                  alt=""
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  class="ppsans"
                  dir="ltr"
                >
                  <tbody>
                    <tr>
                      <td
                        class="mobMargin"
                        align="left"
                        valign="top"
                        style="min-width: 10px"
                      >
                        <table
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td align="center" valign="top" bgcolor="#004f9b">
                                <img
                                  class="imgWidth"
                                  src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-sidebar-left-bottom.jpg"
                                  width="100%"
                                  height="96"
                                  style="display: block"
                                  border="0"
                                  alt=""
                                />
                              </td>
                            </tr>
                            <tr>
                              <td align="right" valign="top">
                                <img
                                  src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/dark-mode/sidebar-gradient.png"
                                  width="1"
                                  height="100"
                                  style="display: block"
                                  alt=""
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td width="600" valign="top" align="center">
                        <br />
                        <table
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                          style="
                            padding: 0px 20px 30px 20px;
                            word-break: break-word;
                          "
                        >
                          <tbody>
                            <tr>
                              <td align="center">
                                <p
                                  class="ppsans"
                                  style="
                                    font-size: 32px;
                                    line-height: 40px;
                                    color: #2c2e2f;
                                    margin: 0;
                                  "
                                  dir="ltr"
                                >
                                  <span
                                    >${userName} sent you a payment
                                    request</span
                                  >
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          id="transactionDetails"
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                align="center"
                                class="ppsans"
                                style="vertical-align: top; padding: 0px 20px"
                              >
                                <table
                                  width="100%"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                  style="padding: 0px 20px 20px 20px"
                                >
                                  <tbody>
                                    <tr>
                                      <td align="center" valign="top">
                                        <p
                                          class="vx_legal-text ppsans"
                                          style="
                                            font-size: 20px;
                                            line-height: 28px;
                                            color: #009cde;
                                            margin: 0;
                                          "
                                          dir="ltr"
                                        >
                                          <span>Payment request details</span>
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="padding: 0px 20px">
                                <table
                                  width="100%"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                  dir="ltr"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        align="center"
                                        style="padding: 0px 0px 30px 0px"
                                      >
                                        <table
                                          id="transactionRow"
                                          width="100%"
                                          align="left"
                                          cellpadding="0"
                                          cellspacing="0"
                                          border="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                class="ppsans"
                                                valign="top"
                                                style="
                                                  font-size: 14px;
                                                  line-height: 18px;
                                                  color: #687173;
                                                "
                                              >
                                                Event
                                              </td>
                                              <td
                                                class="ppsans"
                                                width="50%"
                                                align="right"
                                                valign="top"
                                                style="
                                                  font-size: 14px;
                                                  line-height: 18px;
                                                  color: #687173;
                                                  padding-left: 10px;
                                                "
                                              >
                                                ${eventName}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table
                                  width="100%"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                  dir="ltr"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        align="center"
                                        style="padding: 0px 0px 30px 0px"
                                      >
                                        <table
                                          id="transactionRow"
                                          width="100%"
                                          align="left"
                                          cellpadding="0"
                                          cellspacing="0"
                                          border="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                class="ppsans"
                                                valign="top"
                                                style="
                                                  font-size: 14px;
                                                  line-height: 18px;
                                                  color: #687173;
                                                "
                                              >
                                                Transaction date
                                              </td>
                                              <td
                                                class="ppsans"
                                                width="50%"
                                                align="right"
                                                valign="top"
                                                style="
                                                  font-size: 14px;
                                                  line-height: 18px;
                                                  color: #687173;
                                                  padding-left: 10px;
                                                "
                                              >
                                                ${transactionDate}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td
                                align="center"
                                style="padding: 0px 20px 20px 20px"
                              >
                                <table
                                  width="100%"
                                  cellpadding="0"
                                  cellspacing="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td style="padding: 0px">
                                        <hr
                                          style="border-top: 1px dotted #687173"
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td style="padding: 0px 10px 20px 10px">
                                <table
                                  id="cartDetails"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                  width="100%"
                                  dir="ltr"
                                  style="font-size: 16px"
                                >
                                  <tbody>
                                    <tr>
                                      <td style="width: 70%; padding: 0px 20px">
                                        ${item}
                                      </td>
                                      <td
                                        style="width: 30%; padding: 0px 20px"
                                        align="right"
                                      >
                                        ${price}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td style="padding: 0px 10px 20px 10px">
                                <table
                                  id="cartDetails"
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                  width="100%"
                                  dir="ltr"
                                  style="font-size: 16px"
                                >
                                  <tbody>
                                    <tr>
                                      <td style="padding: 10px 20px">
                                        <table
                                          width="100%"
                                          cellpadding="0"
                                          cellspacing="0"
                                          border="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td style="padding: 0px">
                                                <hr
                                                  style="
                                                    border-top: 1px dotted
                                                      #687173;
                                                  "
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          width="100%"
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                          class="neptuneButtonwhite"
                        >
                          <tbody>
                            <tr>
                              <td
                                align="center"
                                style="padding: 0px 30px 30px 30px"
                              >
                                <table
                                  border="0"
                                  cellspacing="0"
                                  cellpadding="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        align="center"
                                        style="border-radius: 1.5rem"
                                        bgcolor="#0070ba"
                                      >
                                        <a
                                          href=${paypalLink}
                                          target="_blank"
                                          class="ppsans"
                                          style="
                                            line-height: 1.6;
                                            font-size: 15px;
                                            border-radius: 1.5rem;
                                            padding: 10px 20px;
                                            display: inline-block;
                                            border: 1px solid #0070ba;
                                            font-weight: 500;
                                            text-align: center;
                                            text-decoration: none;
                                            cursor: pointer;
                                            min-width: 150px;
                                            background-color: #0070ba;
                                            color: #ffffff;
                                          "
                                          >Pay Now With PayPal</a
                                        >
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td
                        valign="top"
                        align="left"
                        class="mobMargin"
                        style="min-width: 10px"
                      >
                        <table
                          width="100%"
                          cellspacing="0"
                          cellpadding="0"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td valign="top" align="center" bgcolor="#004f9b">
                                <img
                                  width="100%"
                                  border="0"
                                  height="96"
                                  class="imgWidth"
                                  style="display: block"
                                  src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/header-sidebar-right-bottom.jpg"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td valign="top" align="left">
                                <img
                                  width="1"
                                  height="100"
                                  style="display: block"
                                  src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/dark-mode/sidebar-gradient.png"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td class="mobMargin"></td>
                      <td align="center" width="600">
                        <table
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                          dir="ltr"
                        >
                          <tbody>
                            <tr>
                              <td>
                                <table
                                  width="100%"
                                  cellpadding="0"
                                  cellspacing="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        width="12"
                                        align="center"
                                        valign="top"
                                      >
                                        <img
                                          src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/dark-mode/footer-left-corner.png"
                                          width="12"
                                          height="141"
                                          style="display: block"
                                          border="0"
                                          alt=""
                                        />
                                      </td>
                                      <td align="center" valign="top">
                                        <img
                                          src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/dark-mode/footer-left-stroke.png"
                                          width="100%"
                                          height="141"
                                          style="display: block"
                                          border="0"
                                          alt=""
                                        />
                                      </td>
                                      <td
                                        width="120"
                                        align="center"
                                        valign="top"
                                      >
                                        <img
                                          src="https://u.cubeupload.com/payuppal/logo.png"
                                          width="165"
                                          height="100"
                                          style="display: block"
                                          border="0"
                                          alt="PayUpPal"
                                        />
                                      </td>
                                      <td align="center" valign="top">
                                        <img
                                          src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/dark-mode/footer-right-stroke.png"
                                          width="100%"
                                          height="141"
                                          style="display: block"
                                          border="0"
                                          alt=""
                                        />
                                      </td>
                                      <td
                                        width="12"
                                        align="center"
                                        valign="top"
                                      >
                                        <img
                                          src="https://www.paypalobjects.com/digitalassets/c/system-triggered-email/n/layout/images/dark-mode/footer-right-corner.png"
                                          width="12"
                                          height="141"
                                          style="display: block"
                                          border="0"
                                          alt=""
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          id="body_footer_links"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                align="center"
                                style="
                                  font-size: 15px;
                                  line-height: 22px;
                                  color: #444444;
                                  padding: 20px;
                                "
                                class="ppsans"
                              >
                                <a
                                  href="mailto:support@payuppal.xyz"
                                  target="_blank"
                                  class="ppsans"
                                  style="color: #0070ba; text-decoration: none"
                                  alt="Help &amp; Contact"
                                  >Help &amp; Contact</a
                                ><span> | </span
                                ><a
                                  href="http://www.payuppal.xyz/"
                                  target="_blank"
                                  class="ppsans"
                                  style="color: #0070ba; text-decoration: none"
                                  alt="Apps"
                                  >Web App</a
                                >
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="padding-bottom: 20px">
                                <table
                                  align="center"
                                  cellpadding="0"
                                  cellspacing="0"
                                  border="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        align="center"
                                        valign="middle"
                                        width="50"
                                      >
                                        <a
                                          id="github"
                                          href="https://github.com/Silence-of-the-LANs/billsplitter"
                                          target="_blank"
                                          ><img
                                            border="0"
                                            src="https://u.cubeupload.com/payuppal/GitHubMark32px.png"
                                            width="28"
                                            height="28"
                                            style="display: block"
                                            alt="GitHub"
                                        /></a>
                                      </td>
                                      <td
                                        align="center"
                                        valign="middle"
                                        width="50"
                                      >
                                        <a
                                          id="jasonLinkedIn"
                                          href="https://www.linkedin.com/in/jasonliao1"
                                          target="_blank"
                                          ><img
                                            border="0"
                                            src="https://u.cubeupload.com/payuppal/jasonLinkedIn.png"
                                            width="28"
                                            height="28"
                                            style="display: block"
                                            alt="LinkedIn"
                                        /></a>
                                      </td>
                                      <td
                                        align="center"
                                        valign="middle"
                                        width="50"
                                      >
                                        <a
                                          id="tommyLinkedIn"
                                          href="https://www.linkedin.com/in/tommyliu625"
                                          target="_blank"
                                          ><img
                                            border="0"
                                            src="https://u.cubeupload.com/payuppal/tommyLinkedIn.png"
                                            width="28"
                                            height="28"
                                            style="display: block"
                                            alt="LinkedIn"
                                        /></a>
                                      </td>
                                      <td
                                        align="center"
                                        valign="middle"
                                        width="50"
                                      >
                                        <a
                                          id="zoranLinkedIn"
                                          href="https://www.linkedin.com/in/zoranbajic"
                                          target="_blank"
                                          ><img
                                            border="0"
                                            src="https://u.cubeupload.com/payuppal/zoranLinkedIn.png"
                                            width="28"
                                            height="28"
                                            style="display: block"
                                            alt="LinkedIn"
                                        /></a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td class="mobMargin"></td>
                    </tr>
                  </tbody>
                </table>
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="padding-bottom: 20px"
                >
                  <tbody>
                    <tr>
                      <td class="hide"> </td>
                      <td align="center" class="ppsans" width="600">
                        <table
                          id="hideForTextFooter"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                style="
                                  font-size: 13px;
                                  line-height: 20px;
                                  color: #687173;
                                  padding: 10px 30px 10px 30px;
                                "
                              >
                                <p
                                  class="ppsans"
                                  style="font-size: 13px; margin: 0"
                                  dir="ltr"
                                >
                                  <span
                                    >PayUpPal is committed to preventing
                                    fraudulent emails.<a
                                      href="https://www.consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams"
                                      target="_blank"
                                      style="
                                        color: #0070ba;
                                        text-decoration: none;
                                      "
                                    >
                                      Learn to identify phishing</a
                                    ></span
                                  >
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          id="hideForTextFooter"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                style="
                                  font-size: 13px;
                                  line-height: 20px;
                                  color: #687173;
                                  padding: 10px 30px 10px 30px;
                                "
                              >
                                <p
                                  class="ppsans"
                                  style="font-size: 13px; margin: 0"
                                  dir="ltr"
                                >
                                  <span
                                    >Please don't reply to this email. To get in
                                    touch with us, email us at
                                    support@payuppal.xyz
                                    <strong></strong>.</span
                                  >
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          id=""
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                style="
                                  font-size: 13px;
                                  line-height: 20px;
                                  color: #687173;
                                  padding: 10px 30px 10px 30px;
                                "
                              >
                                <p
                                  class="ppsans"
                                  style="font-size: 13px; margin: 0"
                                  dir="ltr"
                                >
                                  <span
                                    >Not sure why you received this email?
                                    <a
                                      href="http://www.payuppal.xyz/"
                                      target="_blank"
                                      style="
                                        color: #0070ba;
                                        text-decoration: none;
                                      "
                                      >Learn more</a
                                    ></span
                                  >
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                style="
                                  font-size: 13px;
                                  line-height: 20px;
                                  color: #687173;
                                  padding: 10px 30px 10px 30px;
                                "
                              >
                                <p
                                  class="ppsans"
                                  style="font-size: 13px; margin: 0"
                                  dir="ltr"
                                ></p>
                                <div style="font-size: 13px" dir="ltr">
                                  <span
                                    >Copyright &copy; 2021 PayUpPal, All rights
                                    reserved.</span
                                  >
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td class="hide"> </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td
                bgcolor="#ffffff"
                class="mobMargin"
                style="font-size: 0px"
              ></td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  </body>
</html>
`,
  };

  transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// sendInitialEmail(
//   'Jason',
//   'Zoran',
//   'jlfliao@gmail.com',
//   'Mezcalero',
//   'Corona',
//   '5.00',
//   'https://www.paypal.me',
//   'March 25, 2020'
// );
