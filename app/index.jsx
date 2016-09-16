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
    return (
      <div>
        <h1>
          {noun}.js
        </h1>
        <Link to={'assets/' + noun}>Download</Link>
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

render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={LibraryList}/>
      <Route path=":noun" component={LibraryPage}/>
      <Route path="assets/:noun" component={LibraryDownload}/>
    </Route>
  </Router>,
  document.getElementById('app'));
