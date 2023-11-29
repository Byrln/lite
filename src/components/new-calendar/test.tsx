import React, { Component, RefObject } from 'react';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css';

interface SchedulerProps {
  events: any[]; // Update the type of events based on your actual data structure
}

export default class Scheduler extends Component<SchedulerProps> {
  private schedulerContainer: RefObject<HTMLDivElement>;

  constructor(props: SchedulerProps) {
    super(props);
    this.schedulerContainer = React.createRef();
  }

  componentDidMount() {
    const scheduler = window.scheduler;

    scheduler.skin = 'material';
    scheduler.config.header = [
      'day',
      'week',
      'month',
      'date',
      'prev',
      'today',
      'next'
    ];

    const { events } = this.props;
    scheduler.init(this.schedulerContainer.current, new Date(2020, 5, 10));
    scheduler.clearAll();
    scheduler.parse(events);
  }

  render() {
    return (
      <div
        ref={this.schedulerContainer}
        style={{ width: '100%', height: '100%' }}
      ></div>
    );
  }
}
