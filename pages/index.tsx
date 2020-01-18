import { useRef } from "react";


const crawlForm = (() => {
  const url = useRef(null);
  const maxDepth = useRef(null);
  const maxPages = useRef(null);

  const maxDepthLimit = 'Max: '+process.env.MAX_DEPTH_LIMIT;
  const maxPageLimit = 'Max: '+process.env.MAX_PAGE_LIMIT;

  const validateAndSubmit = (() => {

  })
  return <form>
    <label>
      Url to crawl:
    <input className='url'
        placeholder="your url"
        ref={url}
        defaultValue={''} />
    </label>
    <br />
    <label>Max depth for crawl:
    <input className='max_depth'
        placeholder={maxDepthLimit}
        ref={maxDepth}
      />
    </label>
    <br />
    <label>Max page for crawl:
    <input className='max_page'
        placeholder={maxPageLimit}
        ref={maxPages}
      />
    </label>
    <br />
    <button className='submit'
      onClick={validateAndSubmit}
    >Start crawling</button>


    <style jsx>{``}</style>

  </form >

})

export default crawlForm