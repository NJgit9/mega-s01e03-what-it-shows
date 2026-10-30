<script>
  import update from '#lib/data/engineering-update.json';
</script>

<p>The <a href={update.source}>course engineering update</a>, observed {update.observedOn}, reports #{update.sourceTicket} closed {update.closedDateAsWritten}.</p>
<ul>
  <li><strong>Parser: {update.parser.status}.</strong> <code>{update.parser.detail}</code></li>
  <li><strong>Hint: {update.hint.status}.</strong> {update.hint.detail}. Retirement is a won't-fix outcome, not a repaired form.</li>
</ul>
<p>{update.verification}</p>
