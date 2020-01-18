import React, { useEffect } from 'react'
import { useRef, useState } from "react";

interface IcrawlForm {
  url: string,
  maxDepth: string,
  maxPage: string
}
const CrawlForm = ((props) => {
  const urlRef = useRef(null);
  const maxDepthRef = useRef(null);
  const maxPagesRef = useRef(null);

  const URL_REGEX = 'http[^?#]*'

  const maxDepthLimit = process.env.MAX_DEPTH_LIMIT;
  const maxPageLimit = process.env.MAX_PAGE_LIMIT;

  const maxDepthLimitMsg = 'Max: ' + process.env.MAX_DEPTH_LIMIT;
  const maxPageLimitMsg = 'Max: ' + process.env.MAX_PAGE_LIMIT;
  const errorsInitState = {
    url: '',
    maxDepth: '',
    maxPage: ''
  }

  const [errors, setErrors] = useState(errorsInitState);
  const [values, setValues] = useState(errorsInitState)
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (props.error) {
      setIsSubmitting(false);
    }
  }, [props.error])

  const changedUrl = ((e) => {
    setValues({ ...values, url: e.target.value });
  })
  const changedDepth = ((e) => {
    setValues({ ...values, maxDepth: e.target.value });
  })
  const changedPages = ((e) => {
    setValues({ ...values, maxPage: e.target.value });
  })

  const validateUrl = (url) => {
    let errors;
    if (url.length <= 0) errors = 'Required!'
    else if (!RegExp(URL_REGEX).test(url)) errors = 'Not a valid URL'
    return errors;
  }

  const validateErrors = (values: IcrawlForm) => {
    const errors = {
      url: '',
      maxDepth: '',
      maxPage: ''
    };
    errors.url = validateUrl(values.url);

    if (values.maxDepth.length <= 0) errors.maxDepth = 'Required!'
    else if (values.maxDepth > maxDepthLimit) errors.maxDepth = 'max dept exceeds limit ' + maxDepthLimit;

    if (values.maxPage.length <= 0) errors.maxPage = 'Required!'
    else if (values.maxPage > maxPageLimit) errors.maxPage = 'max pages exceeds limit ' + maxPageLimit;

    if (errors.url || errors.maxDepth || errors.maxPage) {
      return (errors)
    }
    return null;
  }

  const validateAndSubmit = () => {
    setErrors(errorsInitState);
    const error = validateErrors(values)
    if (!error) {
      props.setCrawl(values);
      setIsSubmitting(true)
    }
    else {
      setErrors(error);
      setIsSubmitting(false);
    }
  }

  return <div>
    <label>
      Url to crawl:
    <input className='url'
        value={values.url}
        placeholder="your url"
        ref={urlRef}
        disabled={isSubmitting}
        onChange={changedUrl} />
      <label className='errors'>{errors.url}</label>
    </label>
    <br />
    <label>Max depth for crawl:
    <input className='max_depth'
        value={values.maxDepth}
        placeholder={maxDepthLimitMsg}
        ref={maxDepthRef}
        disabled={isSubmitting}
        onChange={changedDepth}
      /><label className='errors'>{errors.maxDepth}</label>
    </label>
    <br />
    <label>Max page for crawl:
    <input className='max_page'
        value={values.maxPage}
        placeholder={maxPageLimitMsg}
        ref={maxPagesRef}
        disabled={isSubmitting}
        onChange={changedPages}
      /><label className='errors'>{errors.maxPage}</label>
    </label>
    <br />
    <button className='submit'
      onClick={validateAndSubmit}
      disabled={isSubmitting}
    >Start crawling</button>
    {/* will have to clear on focus */}
    <label className='errors'>{props.error}</label>

    <style jsx>{``}</style>
  </div >

})

export default CrawlForm