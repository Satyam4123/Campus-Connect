
import React from 'react';
import './Main.css'; 
import {
  ArrowRightIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  ChatBubbleLeftRightIcon,
  CubeIcon,
  PencilSquareIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { Button } from 'react-bootstrap';


const Main = () => {
  return (
    <main>
      <section className="section-bg py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="heading">
          Collaborate smarter, create better
          </h1>
          <p className="paragraph">
          Enhance teamwork and creativity with Stark Industries’ innovative collaborative whiteboard, designed for seamless interaction and powered by cutting-edge technology to elevate your projects to new heights
          </p>
          <Button className="primary-button" size="lg">
            Start a whiteboard
            <ArrowRightIcon className="icon-spacing" />
          </Button>

          {/* Interface Preview */}
          <div className="preview-container">
            <div className="preview-header">
              <div className="preview-title">
                {/* <Image src="/placeholder.svg" alt="Mural Logo" width={32} height={32} className="logo" /> */}
                <span className="title-text">We better work</span>
              </div>
              <div className="icon-buttons">
                <Button variant="link" className="icon-button"><ArrowUturnLeftIcon className="icon" /></Button>
                <Button variant="link" className="icon-button"><ArrowUturnRightIcon className="icon" /></Button>
                <Button variant="link" className="icon-button"><CloudArrowUpIcon className="icon" /></Button>
                <Button variant="link" className="icon-button"><CloudArrowDownIcon className="icon" /></Button>
                <Button variant="link" className="icon-button"><MagnifyingGlassIcon className="icon" /></Button>
                <Button variant="link" className="icon-button"><ShareIcon className="icon" /></Button>
                <Button variant="link" className="icon-button"><Cog6ToothIcon className="icon" /></Button>
              </div>
            </div>
            <div className="preview-body">
              <div className="tool-icons">
                <Button variant="link" className="icon-button"><Squares2X2Icon className="icon" /></Button>
                <Button variant="link" className="icon-button"><ChatBubbleLeftRightIcon className="icon" /></Button>
                <Button variant="link" className="icon-button"><CubeIcon className="icon" /></Button>
                <Button variant="link" className="icon-button"><PencilSquareIcon className="icon" /></Button>
                <Button variant="link" className="icon-button"><PhotoIcon className="icon" /></Button>
              </div>
              <div className="canvas">
                <div className="canvas-content">
                  <h3 className="canvas-heading">What's going on here?</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Main;
