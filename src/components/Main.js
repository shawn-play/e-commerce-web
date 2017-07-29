require('normalize.css/normalize.css');
require('../styles/App.css');

import React from 'react';

let imgdata = require('../sources/pages.json');

imgdata = (function getImgUrl(imgdataArr) {
  for (var key in imgdataArr) {
    var singleData = imgdataArr[key];
    singleData.url = require('../images/' + singleData.page);
    imgdataArr[key] = singleData;
  }
  return imgdataArr;
})(imgdata);

class Branch extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.props.page) {
      return;
    }
    this.props.changeRoot(true, this.props.page);
  }

  render() {
    return (
      <li onClick={this.handleClick}>{this.props.desc}</li>
    );
  }
}

class Head extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.changeRoot(false, null);
  }

  render() {
    return (
      <section
        className='head'
        onClick={this.handleClick}>
        {'app: ' + this.props.desc + (this.props.page == '1' ? '' : ' ，点击此处返回上一级')}
      </section>
    );
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.toReverse();
  }

  render() {
    let ifReverClass = 'pages';
    if (this.props.reverse) {
      ifReverClass += ' reverse';
    }
    let branches = [];
    if (!this.props.children) {
      branches.push(
        <Branch
          key={'900'}
          desc={'...'}
          page={false}
          changeRoot={this.props.changeRoot}
        />
      )
    } else {
      let pages = this.props.children.split(',');
      pages.forEach(function (item) {
        branches.push(
          <Branch
            desc={imgdata[item].desc}
            key={item}
            page={item}
            changeRoot={this.props.changeRoot}
          />
        )
      }, this);
    }

    return (
      <section className={ifReverClass}>
        <Head
          page={this.props.page}
          desc={this.props.desc}
          changeRoot={this.props.changeRoot}
        />
        <section className="img" onClick={this.handleClick}>
          <img src={this.props.url} />
          <ul>
            {branches}
          </ul>
        </section>
        <footer>{!this.props.reverse ? '点击页面可查看下级列表' : '点击词条进入下一级，点击空白区域翻转'}</footer>
      </section>
    );
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      root: '1',
      pages: {
        'page': 'login.png',
        'desc': '登录',
        'children': '2,3,4,7,9',
        'reverse': false
      }
    }
    this.changeRoot = this.changeRoot.bind(this);
    this.reverse = this.reverse.bind(this);
  }

  changeRoot() {
    return function (bool, page) {
      if (bool) {
        let item = imgdata[page];
        this.setState({
          root: (this.state.root + ',' + page),
          pages: {
            ...this.state.pages,
            ...item
          }
        })
      } else {
        let pages = this.state.root.split(',');
        let len = pages.length - 1;
        if(len < 1) {
          return;
        }
        let p = pages[len - 1];
        let item = imgdata[p];

        this.setState({
          root: pages.slice(0, len).join(','),
          pages: {
            ...this.state.pages,
            ...item,
            reverse: true
          }
        })

      }

    }.bind(this);
  }

  reverse() {
    return function () {
      this.setState({
        pages: {
          ...this.state.pages,
          reverse: !this.state.pages.reverse
        }
      })
    }.bind(this);
  }

  componentDidMount() {
    let branches = this.state.root.split(',');
    let l = branches.length - 1;
    let id = branches[l];
    let item = imgdata[id];
    this.setState({
      pages: {
        ...this.state.pages,
        ...item
      }
    })
  }

  render() {
    let branches = this.state.root.split(',');
    let l = branches.length - 1;
    let id = branches[l];
    let item = this.state.pages;
    return (
      <section className='auto'>
        <Page
          page={id}
          desc={item.desc}
          url={item.url}
          reverse={item.reverse}
          key={id}
          toReverse={this.reverse()}
          children={this.state.pages.children}
          changeRoot={this.changeRoot()}
        />
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
