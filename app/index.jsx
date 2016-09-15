import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, IndexLink, Link, hashHistory} from 'react-router';
import {render} from 'react-dom';
import {nounList} from '../lib/nounlist';

var App = React.createClass({
  getInitialState: function() {
    return {};
  },
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
  render: function(){
    var libraryLinks = nounList.map(function(noun, i){
      return (
        <span key={noun}>
          <Link to={noun}>{noun}.js</Link>
          <br/>
        </span>
      );
    });
    return (
      <div>
        <h1>
          <i
            className="material-icons"
            title="Hourglass">
            hourglass_empty
          </i>
          Javascript Library Directory
        </h1>
        <div>
          {libraryLinks}
        </div>
      </div>
    );
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
      exports.${noun} = Library;
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
