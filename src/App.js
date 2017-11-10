import React, { Component } from 'react';
import { Row, Button } from 'reactstrap';
import './App.css';

function Square(props) {
  return (
    <div className={props.className} id={props.id} onClick={props.onClick}/>
  );
}

class Board extends Component {
  rowsByColumns(rows, columns) {
    let arr=[];
    for (let i=0;i<rows;i++) {
      arr.push([])
      for (let j=0;j<columns;j++) {
        arr[i].push(<Square />)
      }
    }
    return (arr);
  }

  changeColor(id) {
    if (this.props.living.indexOf(id)>=0) {
      return ("square alive");
    } else {
      return ("square");
    }
  }

  render() {
    let grid = this.rowsByColumns(40,50);
    let i=0;
    let k=0;
    return (
        <div id="board">
          {grid.map((row)=>{
            i++;
            return (
              <Row key={i}>
                {row.map((content)=>{
                  k++;
                  return (
                    <Square key={k} className={this.changeColor(k)} id={k} onClick={(e) => this.props.onClick(e)}/>
                  )
                })}
              </Row>
            )
          })
          }
        </div>
    );
  }
}

class GenerationControls extends Component {
  render() {
    return(
      <div className="container">
        <p>Generation: {this.props.generation}</p>
        <Row className="buttonRow justify-content-center">
          <Button id={this.props.isPlaying?"pause":"play"} color="success" type="button" onClick={(e) => {this.props.onClick(e)}}>{this.props.isPlaying?"Pause":"Play"}</Button>
          <Button id={this.props.living.length>0?"clear":"random"} color="danger" type="button" onClick={(e) => {this.props.onClick(e)}}>{this.props.living.length>0?"Clear":"Random"}</Button>
        </Row>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      generation: 0,
      living: [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleButton = this.handleButton.bind(this);
    this.liveNeighbors = this.liveNeighbors.bind(this);
  }

  handleClick(e) {
    e.stopPropagation();
    let target = e.target;
    if ((this.state.isPlaying===false)&&(target.className === "square" || "square alive")) {
      this.toggleAlive(target)
    }
  }

  toggleAlive(target) {
    let living = this.state.living;
    let i = Number(target.id);
    (living.indexOf(i)>=0)? living.splice(living.indexOf(i),1) : living.push(i);
    this.setState({
      living: living
    })
  }

  handleButton(e) {
    e.stopPropagation();
    let target = e.target;
    switch(target.id) {
      case "play":
        this.setState({
          isPlaying: true,
        });
        this.generationTimer();
        break;
      case "pause":
        clearInterval(this.timer);
        this.setState({
          isPlaying: false,
        });
        break;
      case "clear":
        this.setState({
          isPlaying: false,
          generation: 0,
          living: []
        });
        break;
      case "random":
        this.setState({
          living: this.randomDistribution(),
        })
        break;
      default:
        console.log("Foo");
    }
  }

  randomDistribution() {
    let distribution = [];
    for (let i=1;i<=2000;i++) {
      let randInterval = Math.random() * (0.95 - 0.90) + 0.90;
      let rand = Math.random();
      if(rand>randInterval) {distribution.push(i)}
    }
    return distribution;
  }

  componentDidMount() {
    this.setState({
      isPlaying: true,
      generation: 0,
      living: this.randomDistribution(),
    });
    this.generationTimer();
  }

  generationTimer() {
    this.timer = setInterval(
      () => {
        this.nextRound();
      }, 300);
  }

  liveNeighbors(k) {
    let living = 0;
    let neighbors = this.neighbors(k);
    neighbors.forEach(element => {
      if (this.state.living.indexOf(element) >= 0 ) {
        living++;
      }
    })
    return living;
  }

  nextRound() {
    const living = this.state.living;
    let newLiving = [];

    for (let i=1;i<=2000;i++) {
      let liveNeighbors = this.liveNeighbors(i);
      if (living.indexOf(i)>=0) {
        if (liveNeighbors<=3&&liveNeighbors>=2) {
          newLiving.push(i);
        }
      } else if (liveNeighbors===3) {
          newLiving.push(i);
        }
    }
    this.setState({
      living: newLiving,
    })
    this.generationTick();
  }

  neighbors(i) {
    const firstCol = [1,51,101,151,201,251,301,351,401,451,501,551,601,651,701,751,801,851,901,951,1001,1051,1101,1151,1201,1251,1351,1401,1451,1501,1551,1601,1651,1701,1751,1801,1851,1901,1951];
    let neighbors = [];
    switch(i) {
      case 1:
        neighbors.push(2,51,52);
        break;
      case 50:
        neighbors.push(49,100,99);
        break;
      case 1951:
        neighbors.push(1901,1952,1902);
        break;
      case 2000:
        neighbors.push(1999,1950,1949);
        break;
      default:
        if (firstCol.indexOf(i)>=0) {
          neighbors.push(i+50,i-50,i+1,i-49,i+51);
        } else if (i%50===0) {
          neighbors.push(i+50,i-50,i-1,i-51,i+49);
        } else if (i<=50) {
          neighbors.push(i+1,i-1,i+50,i+49,i+51);
        } else if (i>=1951) {
          neighbors.push(i+1,i-1,i-50,i-49,i-51);
        } else {
          neighbors.push(i+1,i-1,i+50,i-50,i+49,i+51,i-49,i-51);
        }
    }
    return neighbors;
  }


  generationTick() {
    let nextGen = this.state.generation + 1;
    this.setState({
      generation: nextGen
    })
  }

  render() {
    return (
      <div className="App container-fluid">
        <nav className="navbar navbar-expand-lg">
          <a className="navbar-brand" href="https://www.freecodecamp.org/challenges/build-the-game-of-life"><img alt="freeCodeCamp's logo" src="https://s3.amazonaws.com/freecodecamp/freecodecamp_logo.svg"></img></a>
        </nav>
        <main className="row justify-content-center">
          <div id="header" className="container">
            <h1>John Conway's <br/> Game of Life</h1>
          </div>
          <Board living={this.state.living} onClick={this.handleClick}/>
          <GenerationControls isPlaying={this.state.isPlaying} living={this.state.living} generation={this.state.generation} onClick={this.handleButton}/>
        </main>
        <footer>Developed by <a href="http://www.mackmmiller.com/">Mackenzie Miller</a></footer>
      </div>
    );
  }
}

export default App;
