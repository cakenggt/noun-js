import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, IndexLink, Link, hashHistory} from 'react-router';
import {render} from 'react-dom';
import ReactPaginate from 'react-paginate';
import {nounList} from '../lib/nounlist';

var App = React.createClass({
  render: function() {
    return (
      <div>
        {React.Children.map(this.props.children, child => {
          return React.cloneElement(child);
        })}
      </div>
    );
  }
});

var LibraryList = React.createClass({
  getInitialState: function(){
    return {
      pageNum: 0
    }
  },
  render: function(){
    var numOnPage = 10;
    var start = this.state.pageNum*numOnPage;
    var stop = start+numOnPage;
    var libraryLinks = nounList.slice(start, stop).map(function(noun, i){
      return (
        <Link
          to={noun}
          key={noun}>
          <li
            className="library-item">
            <h3>
              {noun}.js
            </h3>
          </li>
        </Link>
      );
    });
    return (
      <div>
        <div
          className="header">
          <h1>
            <i
              className="material-icons"
              title="Javascript Library Directory">
              book
            </i>
            Javascript Library Directory
          </h1>
          <h2>
            This page is the definitive directory of all up and coming
            noun based JavaScript libraries
          </h2>
        </div>
        <div
          id="libraryList"
          className="library-list">
          <ul
            className="library-list-ul">
            {libraryLinks}
          </ul>
          <ReactPaginate previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={<a href="">...</a>}
            breakClassName={"break-me"}
            pageNum={Math.ceil(nounList.length/numOnPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            clickCallback={this.handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"} />
        </div>
      </div>
    );
  },
  handlePageClick: function(data){
    var selected = data.selected;
    this.setState({pageNum:selected});
  }
});

var LibraryPage = React.createClass({
  render: function(){
    var noun = this.props.params.noun;
    var capNoun = noun.substr(0,1).toUpperCase()+noun.substr(1);
    var quote1 = `I firmly believe that ${noun}.js is going to redefine the way we approach web development, nay, engineering in the future`;
    var quote2 = `Forget MV*, we'll be valuing companies based on what kind of ${noun}.js framework they are using soon`;
    return (
      <div
        className="library-container">
        <h1>
          {noun}.js
        </h1>
        <p
          className="library-description">
          <strong>{capNoun}</strong> is the next big JavaScript library, transforming the
          web development ecosystem into a powerhouse
          ready to supplant all native applications.
        </p>
        <BlockQuote quote={quote1} author="Bill Gates, Microsoft CEO"/>
        <BlockQuote quote={quote2} author="Steve Jobs, Apple CEO"/>
        <p
          className="library-description">
          What are you waiting for? <Link to={'assets/' + noun}>Download {noun}.js</Link> before this wave
          moves on without you!
        </p>
        <h2>
          Documentation
        </h2>
        <p
          className="library-description">
          Coming soon!
        </p>
      </div>
    );
  }
});

var LibraryDownload = React.createClass({
  render: function(){
    var noun = this.props.params.noun;
    var library = `(function(exports){
      var Library = {};
      Library.Array = function(){
        this.array = [];
      };
      exports["${noun}"] = Library;
    })(typeof exports !== 'undefined' ? exports : this);`;
    return (
      <div>
        {library}
      </div>
    );
  }
});

var BlockQuote = React.createClass({
  propTypes: {
    quote: React.PropTypes.string.isRequired,
    author: React.PropTypes.string
  },
  render: function(){
    return (
      <div>
        <blockquote>
          <span className="open">“</span>
            {this.props.quote}
          <span className="close">”</span>
        </blockquote>
        <i>{this.props.author}</i>
      </div>
    );
  }
});

render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={LibraryList}/>
      <Route path=":noun" component={LibraryPage}/>
      <Route path="assets/:noun" component={LibraryDownload}/>
    </Route>
  </Router>,
  document.getElementById('app'));
