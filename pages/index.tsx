import { useRef, useState } from "react";

interface IcrawlForm {
  url: string,
  maxDepth: string,
  maxPages: string
}
const crawlForm = (() => {
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
    maxPages: ''
  }

  const [errors, setErrors] = useState(errorsInitState);
  const [values, setValues] = useState(errorsInitState)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changedUrl=((e)=> {
    setValues({...values, url: e.target.value});
  })
  const changedDepth=((e)=> {
    setValues({...values, maxDepth: e.target.value});
  })
  const changedPages=((e)=> {
    setValues({...values, maxPages: e.target.value});
  })

  const validateUrl = ((url)=>{
    let errors;;
    if (url.length <= 0) errors = 'Required!'
    else if (!RegExp(URL_REGEX).test(url)) errors = 'Not a valid URL'
    return errors;
  })

  const validateErrors = ((values: IcrawlForm) => {
    return new Promise<IcrawlForm>((resolve, reject) => {
      const errors = {
        url: '',
        maxDepth: '',
        maxPages: ''
      };
      errors.url = validateUrl(values.url);
     
      if (values.maxDepth.length <= 0) errors.maxDepth = 'Required!'
      else if (values.maxDepth > maxDepthLimit) errors.maxDepth = 'max dept exceeds limit ' + maxDepthLimit;

      if (values.maxPages.length <= 0) errors.maxPages = 'Required!'
      else if (values.maxPages > maxPageLimit) errors.maxPages = 'max pages exceeds limit ' + maxPageLimit;

      if (errors.url || errors.maxDepth || errors.maxPages) {
        reject(errors)
      }
      else {
        resolve();
      }
    })
  })

  const validateAndSubmit = (() => {
    setErrors(errorsInitState);
    validateErrors(values)
      .then(() => {
        console.log('submitting...');
        setIsSubmitting(true)
      })
      .catch((error) => {
        setErrors(error);
        setIsSubmitting(false);
      })
  })
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
        value={values.maxPages}
        placeholder={maxPageLimitMsg}
        ref={maxPagesRef}
        disabled={isSubmitting}
        onChange={changedPages}
      /><label className='errors'>{errors.maxPages}</label>
    </label>
    <br />
    <button className='submit'
      onClick={validateAndSubmit}
      disabled={isSubmitting}
    >Start crawling</button>


    <style jsx>{``}</style>

  </div >

})

export default crawlForm