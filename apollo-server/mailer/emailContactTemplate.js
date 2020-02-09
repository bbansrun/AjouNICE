module.exports = (name, content) => `
<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <style type="text/css">
            html, body, div, span, applet, object, iframe,
            h1, h2, h3, h4, h5, h6, p, blockquote, pre,
            a, abbr, acronym, address, big, cite, code,
            del, dfn, em, img, ins, kbd, q, s, samp,
            small, strike, strong, sub, sup, tt, var,
            b, u, i, center,
            dl, dt, dd, ol, ul, li,
            fieldset, form, label, legend,
            table, caption, tbody, tfoot, thead, tr, th, td,
            article, aside, canvas, details, embed, 
            figure, figcaption, footer, header, hgroup, 
            menu, nav, output, ruby, section, summary,
            time, mark, audio, video {
                margin: 0;
                padding: 0;
                border: 0;
                vertical-align: baseline;
            }
            article, aside, details, figcaption, figure, 
            footer, header, hgroup, menu, nav, section {
                display: block;
            }
            ol, ul {
                list-style: none;
            }
            blockquote, q {
                quotes: none;
            }
            blockquote:before, blockquote:after,
            q:before, q:after {
                content: '';
                content: none;
            }
            table {
                border-collapse: collapse;
                border-spacing: 0;
            }

            img {
              max-width: 100%;
            }

            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              box-sizing: border-box;
              font-size: 14px;
              text-align: center;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: none;
              width: 100% !important;
              height: 100%;
              line-height: 1.6em;
              background: #f6f6f6;
            }
        
            h1, h2 {
                text-align: center;
            }

            footer {
                text-align: center;
                margin-top: auto;
                background: #17553E;
                color: #fff;
                padding: .5rem 0;
            }

            footer > span {
                font-weight: 400;
            }

            header.title {
                line-height: 1.6;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                padding: .5rem 0;
            }

            .invoice {
                padding: 2rem 0;
                background: #eee;
            }

            h2 {
              text-align: center;
              margin-bottom: 1rem;
            }

            p {
              text-align: center;
              padding: 0 2rem;
            }

            article {
              text-align: center;
            }

            .btn {
                text-align: center;
                display: inline-block;
                background: linear-gradient(45deg, #F86F2E, #EE007A);
                padding: 1rem 4rem;
                -webkit-box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
                box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
                color: #fff !important;
                -webkit-transition: .2s all ease;
                transition: .2s all ease;
                margin-top: 2rem;
                text-decoration: none;
            }

            .btn:hover {
              text-decoration: none;
            }

            .btn:visited {
              color: #fff !important;
            }

            @media only screen and (max-width: 640px) {
              body {
                padding: 0 !important;
              }
        
              h1 {
                font-weight: 800 !important;
              }
        
              h2 {
                font-weight: 800 !important;
              }
        
              h3 {
                font-weight: 800 !important;
              }
        
              h4 {
                font-weight: 800 !important;
              }
        
              h1 {
                font-size: 22px !important;
              }
        
              h2 {
                font-size: 18px !important;
              }
        
              h3 {
                font-size: 16px !important;
              }
        
              .container {
                padding: 0 !important;
                width: 100% !important;
              }
        
              .content {
                padding: 0 !important;
              }
        
              .content-wrap {
                padding: 10px !important;
              }
        
              .invoice {
                width: 100% !important;
              }
            }
        </style>
    </head>
    <body itemscope itemtype="http://schema.org/EmailMessage">
        <header class="title">
            <h1>AjouNICE!</h1>
        </header>
        <div class="invoice">
            <article>
                <h2>${name}님께서 보내신 문의 이메일입니다.</h2>
                ${content}
            </article>
        </div>
        <footer>
            <span>&copy; Copyright bbansrun.</span>
        </footer>
    </body>
</html>
`;
