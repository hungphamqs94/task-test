import Link from "next/link";

export default function Footer() {
  return (
    <div className="footer_bottom">
      <div className="container">
        <div className="row">
          <div className="col-md-5 footer_about_section">
            <h3>
              <b>About Us</b>
            </h3>
            <p className="text-justify about_footer">
              TicketKet is an NFT marketplace deployed on Polygon testnet.
            </p>
            <a href="https://github.com/hungphamqs94/task-test">
              <button id="commonbuttons">
                <b>Know More</b>
              </button>
            </a>
          </div>
          <div className="col-md-3 footer_quicklinks_section">
            <h3>
              <b>Quick Links</b>
            </h3>
            <ul className="footer-links">
              <li>
                <a href="https://github.com/hungphamqs94/task-test">Source code</a>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4 footer_contact_section">
            <h3>
              <b>Contact Us</b>
            </h3>
            <ul className="footer-links">
              <li>
                <a href="mailto:adiunni@hotmail.com?subject =Contact you regarding Ticket Check = Message">
                  <i className="fa fa-2x fa-envelope" aria-hidden="true"></i>{" "}
                 hungphamit94@gmail.com
                </a>
              </li>
            </ul>
            <br />
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
